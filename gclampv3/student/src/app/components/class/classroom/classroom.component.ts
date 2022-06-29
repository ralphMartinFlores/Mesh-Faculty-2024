import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common'; 
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.scss']
})
export class ClassroomComponent implements OnInit {

  isWideScreen$: Observable<boolean> | undefined;
  showtab: boolean = false;
  instructor: any = [];
  students: any = [];

  constructor(private _location: Location, private _ds: DataService, public _user: UserService, private route: Router) { }

  ngOnInit(): void {
    this.InitializeClassmembers()
    this.getUnread()
  }

  // ngOnDestroy(): void {
  //   window.sessionStorage.removeItem(btoa('teacher'));
  //   window.sessionStorage.removeItem(btoa('students'));
  // }

  InitializeClassmembers(){
    let load = {
      data:{
        classcode:this._user.getSelectedClass().classcode_fld,
        acadyear:this._user.getAcadYear(),
        semester:this._user.getSemester()
      }
    }
    this._ds._httpRequest('getmembers',load,1).subscribe((data:any)=>{
      data = this._user._decrypt(data.a);
      
      
      if (data.payload != null) {
        this.instructor = data.payload.instructor;
        this._user.setTeachers(this.instructor);
        this.students = data.payload.student;
        this._user.setStudents(this.students);
      }
    },er => {
      er = this._user._decrypt(er.error.a);
      
    })
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

}
