import { Component, OnInit } from '@angular/core';
import { CreateGroupComponent } from './create-group/create-group.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
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

  constructor(public _dialog: MatDialog, public ds: DataService, public user: UserService, private route: Router) { }

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

  public createGroupDialog (): void {
    let dialogRef = this._dialog.open(CreateGroupComponent, {
      maxHeight: "85vh",
      maxWidth: "90vw"
    });

    dialogRef.afterClosed().subscribe(participant => {
      // console.log('closed');
    });

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
  isMobile(){
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width < 480;
  }
  openGroupChat(){
    if(this.isMobile()){
      console.log('group chat opened');
      const x = document.getElementsByClassName("groupmessages__container")[0] as HTMLElement; //('')
      const y = document.getElementsByClassName("groups__container")[0] as HTMLElement; //('')
      x.style.display = "block";
      y.style.display = "none";
    }else{
      //Open group chat in desktop mode 
    }

  }
  onBackButton(){
    const x = document.getElementsByClassName("groupmessages__container")[0] as HTMLElement; //('')
    const y = document.getElementsByClassName("groups__container")[0] as HTMLElement; //('')
    x.style.display = "none";
    y.style.display = "block";
  }

  splitEmail(email) {
    const arr = email.split('@')
    return arr[0]
  }
}
