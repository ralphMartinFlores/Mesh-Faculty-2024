import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  myId: string = 'Austin Ray Aranda';
  myid: any = '';
  selectedRoom  = '';
  groupNameisActive = {};
  groupMessage: FormGroup;

  @ViewChild('scrollTarget') private myScrollContainer: ElementRef;
  @ViewChild('scrollframe') private scrollFrame: ElementRef;
  
  // Sample Data from the backend .. 
  public grouparray = [
    {
      "id": "1",
      "name": "Team 1 - Flash Coders",
      "src" : "assets/images/groups-icon.png",
      "dateCreated" : "June 19 2022",
      
    },
    {
      "id": "2",
      "name": "Team 2 - Debug Entity",
      "src" : "assets/images/groups-icon.png",
      "dateCreated" : "June 20 2022"
    },
    {
      "id": "3",
      "name": "Team 3 - GC Mesh",
      "src" : "assets/images/groups-icon.png",
      "dateCreated" : "June 20 2022"

    },
    {
      "id": "4",
      "name": "Team 4 - Plantip",
      "src" : "assets/images/groups-icon.png",
      "dateCreated" : "June 20 2022"

    },
    {
      "id": "5",
      "name": "Team 5 - Herecut",
      "src" : "assets/images/groups-icon.png",
      "dateCreated" : "June 20 2022"

    },
    {
      "id": "6",
      "name": "Team 6 - GC Clip",
      "src" : "assets/images/groups-icon.png",
      "dateCreated" : "June 20 2022"

    }
  ];


  public chats =  [
    {
      "id": "1",
      "content_fld": "Ex ullamco aliqua excepteur eiusmod excepteur non ipsum. Irure deserunt in enim deserunt magna labore Lorem cillum quis proident. Dolor minim pariatur ullamco nostrud. Ad est irure nisi aliqua consequat dolore labore ex ut ex esse eiusmod.",
      "sender_fld": "Austin Ray Aranda",
      "datetime_fld": "June 20 2022",
      "username": "John",
      "img": "assets/images/groups-icon.png"
    },
    {
      "id": "2",
      "content_fld": "Lorem Ipsum",
      "sender_fld": "Austin Ray Aranda",
      "datetime_fld": "June 20 2022",
      "username": "John",
      "img": "assets/images/groups-icon.png"

    },
    {
      "id": "3",
      "content_fld": "Ex ullamco aliqua excepteur eiusmod excepteur non ipsum. Irure deserunt in enim deserunt magna labore Lorem cillum quis proident. Dolor minim pariatur ullamco nostrud. Ad est irure nisi aliqua consequat dolore labore ex ut ex esse eiusmod.",
      "sender_fld": "Allen Eduard Uy",
      "datetime_fld": "June 20 2022",
      "username": "John",
      "img": "assets/images/groups-icon.png"
    },
    {
      "id": "4",
      "content_fld": "Ex ullamco aliqua excepteur eiusmod excepteur non ipsum. Irure deserunt in enim deserunt magna labore Lorem cillum quis proident. Dolor minim pariatur ullamco nostrud. Ad est irure nisi aliqua consequat dolore labore ex ut ex esse eiusmod.",
      "sender_fld": "Christian V. Alip",
      "datetime_fld": "June 20 2022",
      "username": "John",
      "img": "assets/images/groups-icon.png"
    },
    {
      "id": "5",
      "content_fld": "Ex ullamco aliqua excepteur eiusmod excepteur non ipsum. Irure deserunt in enim deserunt magna labore Lorem cillum quis proident. Dolor minim pariatur ullamco nostrud. Ad est irure nisi aliqua consequat dolore labore ex ut ex esse eiusmod.",
      "sender_fld": "Bernie L. Inociete",
      "datetime_fld": "June 20 2022",
      "username": "John",
      "img": "assets/images/groups-icon.png"
    }
  ]


  public members =  [
    {
      "id": "1",
      "fullname": "Bernie Inociete",
      "src": "assets/images/groups-icon.png",
      "studnum": "201810144"
    },
    {
      "id": "2",
      "fullname": "Bernie Inociete",
      "src": "assets/images/groups-icon.png",
      "studnum": "201810144"
    },
    {
      "id": "3",
      "fullname": "Bernie Inociete",
      "src": "assets/images/groups-icon.png",
      "studnum": "201810144"
    },
    {
      "id": "3",
      "fullname": "Bernie Inociete",
      "src": "assets/images/groups-icon.png",
      "studnum": "201810144"
    },
    {
      "id": "4",
      "fullname": "Bernie Inociete",
      "src": "assets/images/groups-icon.png",
      "studnum": "201810144"
    }
  ]

  // End

  constructor(
    public ds: DataService, 
    public user: UserService, 
    private route: Router,
    private _fb: FormBuilder,
    private _dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.initializeComponents();
    this.groupMessage = this._fb.group({
      messageContent: ['', Validators.required],
    });
  }


  chatBody(data, index): void {
    
    console.log('data', data);
    this.selectedRoom = data
    this.groupNameisActive = data
    this.scrollToNewMessage();

  }

  videocall(): void{
    console.log('videocall has been triggered');
  }

  call(): void{
    console.log('call has been triggered');

  }


  addMessage(message: string): void {
    // CHORE: Revamp DOM Manipulations for animationDelay .. 
    const element = <HTMLElement> document.getElementsByClassName('chatDivReply')[0];
    element.style.animationDelay = "--delay: 0s"

  // Sample for testing if nag chat si user .. 
   this.chats.push(
    {
      "id": "1",
      "content_fld": `${message}`,
      "sender_fld": "Austin Ray Aranda",
      "datetime_fld": "June 20 2022",
      "username": "John",
      "img": "assets/images/groups-icon.png"
    }
   )
   this.groupMessage.reset()
    this.scrollToNewMessage();
  }

  showGroupMembers: boolean = false
  seegroupMembers(): void{
    console.log('group members triggered');
    this.showGroupMembers = true;
  }

  backToChat(){
    this.showGroupMembers = false;
  }


  private scrollToNewMessage(): void {
    setTimeout(() => {
      this.myScrollContainer.nativeElement.scroll({
        top: this.myScrollContainer.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    }, 200);
  }

  
  initializeComponents = () => {
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
    return width < 769;
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
