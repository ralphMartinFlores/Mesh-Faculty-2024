import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-group-messaging',
  templateUrl: './group-messaging.component.html',
  styleUrls: ['./group-messaging.component.scss']
})
export class GroupMessagingComponent implements OnInit {

  allStudents: any = [];
  students: any = [];
  url = this.route.url.split('/');
  classcode = this.url[3];

  public grouparray = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];

  constructor(public ds: DataService, public user: UserService, private route: Router) { }

  ngOnInit(): void {
    this.initializeComponents();
  }
  
  initializeComponents() {
    this.getGroups();
    this.allStudents = this.user.getClassMembers().student;
    this.students = this.allStudents;
  }

  getGroups() {
    this.ds._httpRequest('getgroups', { data: { classcode: this.classcode, id: this.splitEmail(this.user.getUserEmail()) } }, 1).subscribe((dt: any) => {
      dt = this.user._decrypt(dt.a)
      console.log(dt)
    }, er => {
      er = this.user._decrypt(er.error.a)
    })
  }

  splitEmail(email) {
    const arr = email.split('@')
    return arr[0]
  }


}
