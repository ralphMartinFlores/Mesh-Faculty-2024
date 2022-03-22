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
  private _snackBar: MatSnackBar
  ) { }
 
  meetingObj : any = [];

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getScheduleMeetingsbySubject();
  }
  ngAfterViewInit() {

  timer(0, 1000).subscribe(() => {
    this.datetime = new Date()
  })

    this.meetingObj();
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
          meetings.meetstarttime_fld = this.formatTimeShow(parseInt(meetings.meetstarttime_fld));
          meetings.meetendtime_fld = this.formatTimeShow(parseInt(meetings.meetendtime_fld))
        })
      }
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }

  onCopy(value: any){
    this.clipboard.copy(value);
    this._displaySnackBar('Copied to clipboard', 'Close', 'success', 'bottom');
  }

  
  public formatTimeShow(h_24) {
    var h = h_24 % 12;
    if (h === 0) h = 12;
    return (h < 10 ? '0' : '') + h + ':00' + (h_24 < 12 ? 'am' : 'pm');
  }
  _displaySnackBar = (message: string, action: string, pc: string, pos: any): any => this._snackBar.open(message, action, { panelClass: pc, verticalPosition: pos, duration: 3000 });

}
