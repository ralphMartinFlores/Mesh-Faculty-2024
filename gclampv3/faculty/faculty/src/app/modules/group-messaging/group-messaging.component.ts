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
    this.getSavedMessages();
    this.allStudents = this.user.getClassMembers().student;
    console.log(this.allStudents)
    this.students = this.allStudents;
  }



  getGroups() {
    
    const data = { 
      classcode: this.classcode, 
      id: this.splitEmail(this.user.getUserEmail()) 
    } 

    this.ds._httpRequest('grouplist/', data, 5).subscribe((dt: any) => {
      console.log('GROUPS: ', dt)
      dt = this.user._decrypt(dt.d)
    }, er => {
      console.log(er)
      // er = this.user._decrypt(er.error.a)
    })
  }

  getSavedMessages() {
    this.ds._httpRequest("savedmessages/", {gid: '30398'}, 5).subscribe(dt => {
      console.log('SAVED MESSAGES: ', dt)
    }, (er) =>{
      console.log(er)
    })
  }

  splitEmail(email) {
    const arr = email.split('@')
    return arr[0]
  }


}
