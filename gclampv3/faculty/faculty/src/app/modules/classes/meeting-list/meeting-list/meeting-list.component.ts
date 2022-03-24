import { Component, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
// Imports for responsive sidenav
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { delay } from 'rxjs/operators';
import { timer } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { Clipboard } from "@angular/cdk/clipboard";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss']
})
export class MeetingListComponent {

// Variables needed for a responsive sidenav
@ViewChild(MatSidenav)
sidenav!: MatSidenav;
datetime: Date;

constructor(private observer: BreakpointObserver,
  private _ds: DataService,
  public _user: UserService,
  private clipboard: Clipboard,
  private _snackBar: MatSnackBar,
  private _router: Router
  ) { }
 

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getScheduleMeetingsbySubject();
  }
  ngAfterViewInit() {

  timer(0, 1000).subscribe(() => {
    this.datetime = new Date()
  })
    // Observes for breakpoint changes and changes sidenav mode to be more responsive
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });
  }


  scheduledMeetings : any [] = []
    getScheduleMeetingsbySubject = () => {
    let load = {
      data: {
        classCode: this._user.getClassroomInfo().classcode_fld,
        empcode_fld: this._user.getUserID()
      }
    }
     this._ds._httpRequest('getScheeduleMeetingsbySubject', load, 1).subscribe(async (dt: any) => {
      dt = this._user._decrypt(dt.a);
      if (dt.status.remarks === 'success'){
        this.scheduledMeetings = dt.payload;
        this.scheduledMeetings.forEach(meetings => {
          meetings.meetstarttime_fld = this.formatTimeShow(meetings.meetstarttime_fld);
          meetings.meetendtime_fld = this.formatTimeShow(meetings.meetendtime_fld)
        })
      }
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }

  editScheduledMeeting(recno_fld){
    // console.log(recno_fld);
    this._router.navigate(['/main/meeting/'+ recno_fld]);
  }

  onCopy(value: any){
    this.clipboard.copy(value);
    this._displaySnackBar('Copied to clipboard', 'Close', 'success', 'bottom');
  }

  
  public formatTimeShow(time) {
    let hour = (time.split(':'))[0]
    let min = (time.split(':'))[1]
    let part = hour > 12 ? 'PM' : 'AM';
    
    min = (min).length == 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour).length == 1 ? `0${hour}` : hour;
  
    return (`${hour}:${min} ${part}`)
  }
  _displaySnackBar = (message: string, action: string, pc: string, pos: any): any => this._snackBar.open(message, action, { panelClass: pc, verticalPosition: pos, duration: 3000 });

}
