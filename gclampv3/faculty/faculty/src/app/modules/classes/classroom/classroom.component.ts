import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.scss']
})
export class ClassroomComponent implements OnInit, OnDestroy {

  isWideScreen$: Observable<boolean> | undefined;
  showtab: boolean = false;
  selectedIndex = 0;

  constructor(private breakpoint: BreakpointObserver, 
    public _user: UserService, 
    private _ds: DataService,
    private route: Router) { }

  ngOnInit(): void {
    this.getClassList();
    this.getUnread()
  }

  ngOnDestroy(): void {
    window.sessionStorage.removeItem(btoa('classmembers'));
    window.sessionStorage.removeItem('matindex')
  }

  setIndex(index) {
    this._user.setSelectedTabIndex(index);
  }

  getClassList() {
    let load = {
      data: {
        classcode: this._user.getClassroomInfo().classcode_fld,
        acadyear: this._user.getSettings().acadyear_fld,
        semester: this._user.getSettings().sem_fld
      }
    }
    this._ds._httpRequest('getmembers', load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this._user.setClassMembers(dt.payload);
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }

  unreadCount = null

  getUnread() {
    this._ds._httpRequest('getunread', { roomcode: this.route.url.split('/')[3], recipient: this._user.getUserID() }, 1).subscribe(async(res:any) => {
      const data = await this._user._decrypt(res.a); 
      this.unreadCount = data.payload.length;  
      this._user.setMessageBadge(this.unreadCount)
    }, er => {
      er = this._user._decrypt(er.error.a)
      this._user.setMessageBadge('')
    })
  }

  schedMeeting(data){
    this._user.setMeetingInfo(data);
  }

  scheduleMeetingRoute() {
    this.route.navigate(['/main/meeting/', this.route.url.split('/')[3]])
  }

}
