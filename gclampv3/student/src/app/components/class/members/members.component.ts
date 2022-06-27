import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { staggereffect } from '../animation';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  animations: [
  staggereffect
]
})
export class MembersComponent implements OnInit {
  instructor: any;
  students: any;
  fullname: any;
  department: any;
  profilepic: any;

  pageslice;

  constructor(public _user:UserService, public _ds:DataService) { }


  ngOnInit(): void {
    this.getMembers();
    
  }

  OnpageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.students.length) {
      endIndex = this.students.length;
    }
    this.pageslice = this.students.slice(startIndex, endIndex);
  }

  getMembers(){
    this.instructor = this._user.getTeachers();
    if (this.instructor[0]['fname_fld'] == null) {
      this.fullname = "TBA";
      this.department = "TBA";
      this.profilepic = null;

    }else{
      this.fullname = this.instructor[0]['fname_fld'] +" "+this.instructor[0]['lname_fld'];
      this.department = this.instructor[0]['dept_fld'];
      this.profilepic = this.instructor[0]['profilepic_fld'];

    }
    this.students = this._user.getStudents();

    this.pageslice = this.students.slice(0, 18);
    // console.log(this.students,this.instructor);
    
    // console.log(this.instructor);
    
  }

  

}
