import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { SocketService } from 'src/app/services/socket.service';

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
  groups: any[] = []

  myId: string = 'Austin Ray Aranda';
  myid: any = '';
  selectedRoom: any = [];
  groupNameisActive = {};
  groupMessage: FormGroup;

  filter: any;

  @ViewChild('scrollTarget') private myScrollContainer: ElementRef;
  @ViewChild('scrollframe') private scrollFrame: ElementRef;
  @ViewChild('emptyContainerElement') emptyContainerElement?: ElementRef;
  @ViewChild('noSelectedConversationElement') noSelectedConversationElement?: ElementRef;
  @ViewChild('greetingsElement') greetingsElement?: ElementRef;

  public emptyContainerElementRef: any;
  public noSelectedConversationElementRef: any;
  public greetingsElementRef: any;
  
  // Sample Data from the backend .. 
  public grouparray = [];

  public chats =  []

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
    },
    {
      "id": "5",
      "fullname": "Bernie Inociete",
      "src": "assets/images/groups-icon.png",
      "studnum": "201810144"
    },
    {
      "id": "6",
      "fullname": "Bernie Inociete",
      "src": "assets/images/groups-icon.png",
      "studnum": "201810144"
    },
    {
      "id": "7",
      "fullname": "Bernie Inociete",
      "src": "assets/images/groups-icon.png",
      "studnum": "201810144"
    },
    {
      "id": "7",
      "fullname": "Bernie Inociete",
      "src": "assets/images/groups-icon.png",
      "studnum": "201810144"
    },
    {
      "id": "7",
      "fullname": "Bernie Inociete",
      "src": "assets/images/groups-icon.png",
      "studnum": "201810144"
    },
    {
      "id": "7",
      "fullname": "Bernie Inociete",
      "src": "assets/images/groups-icon.png",
      "studnum": "201810144"
    },
    {
      "id": "7",
      "fullname": "Bernie Inociete",
      "src": "assets/images/groups-icon.png",
      "studnum": "201810144"
    },
    {
      "id": "7",
      "fullname": "Bernie Inociete",
      "src": "assets/images/groups-icon.png",
      "studnum": "201810144"
    },    {
      "id": "7",
      "fullname": "Bernie Inociete",
      "src": "assets/images/groups-icon.png",
      "studnum": "201810144"
    },
    {
      "id": "7",
      "fullname": "Bernie Inociete",
      "src": "assets/images/groups-icon.png",
      "studnum": "201810144"
    },
    {
      "id": "7",
      "fullname": "Bernie Inociete",
      "src": "assets/images/groups-icon.png",
      "studnum": "201810144"
    },
    {
      "id": "7",
      "fullname": "Bernie Inociete",
      "src": "assets/images/groups-icon.png",
      "studnum": "201810144"
    },
    {
      "id": "7",
      "fullname": "Bernie Inociete",
      "src": "assets/images/groups-icon.png",
      "studnum": "201810144"
    },
    {
      "id": "7",
      "fullname": "Bernie Inociete",
      "src": "assets/images/groups-icon.png",
      "studnum": "201810144"
    },
    {
      "id": "7",
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
    private _dialog: MatDialog,
    public socket: SocketService
  ) { }


  ngOnInit(): void {
    this.initializeComponents();
    this.groupMessage = this._fb.group({
      messageContent: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.emptyContainerElementRef = this.emptyContainerElement.nativeElement;
    this.noSelectedConversationElementRef = this.noSelectedConversationElement.nativeElement;
    this.greetingsElementRef = this.greetingsElement.nativeElement;
  }


  initializeComponents = () => {
    this.myId = this.splitEmail(this.user.getEmail())
    this.getGroups();
    this.students = this.allStudents;
  }

  async chatBody(data, index): Promise<any> {

    this.getSavedMessages(data.groupid_fld);
    console.log('data', data);
    this.selectedRoom = await data
    this.groupNameisActive = await data
    this.scrollToNewMessage();
  }

  videocall(): void{
    console.log('videocall has been triggered');
  }

  call(): void{
    console.log('call has been triggered');

  }


  addMessage(message: string): any {

    document.getElementsByClassName("groupmessages__container")[0] as HTMLElement

    // CHORE: Revamp DOM Manipulations for animationDelay .. 
    const element = document.getElementsByClassName("chatDivReply")[0] as HTMLElement;
    element.style.animationDelay = "--delay: 0s"

    if (message === "") return false; 
    const sender = this.splitEmail(this.user.getEmail())
    const time = new Date()
    const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });

    this.socket.chat(message, sender, formattedTime)
    this.chats.push({ content_fld: message, sender_fld: sender, datetime_fld: formattedTime})
    this.scrollToNewMessage()
    this.saveMessage(message, time)
    this.groupMessage.reset()
  }

  public saveMessage(message: string, dateTime: any): void {
    const senderName = this.user.getFullname()
    const load = {
        groupid_fld: this.selectedRoom.groupid_fld,
        sender_fld: this.splitEmail(this.user.getEmail()),
        sendername_fld: senderName,
        content_fld: message,
        datetime_fld: dateTime
    }

    this.ds._httpRequest("addgrpmsg/", load, 1).subscribe(res => {
      let dt = res
      // DO SOMETHING
    }, (er) =>{
      er = er.error
    })
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


  backupGroupArray: any[] = [];
  getGroups() {
    console.log(this.user.getEmail())
    const load = { 
      data: {
        cc: this.classcode, 
        id: this.splitEmail(this.user.getEmail()) 
      } 
    } 

    this.ds._httpRequest('getgroups/', load, 1).subscribe((dt: any) => {
      dt = dt
      this.grouparray = dt.payload
      this.backupGroupArray = dt.payload
      console.log(this.grouparray.length)
      // Show Empty Illustration if there are no groups yet
      if (this.grouparray.length > 0) {
        this.emptyContainerElementRef.style.display = 'none';
        this.noSelectedConversationElementRef.style.display = 'block';
        this.greetingsElementRef.style.display = 'none';
      }
    }, er => {
      er = er.error
    })

  }

  getSavedMessages(groupid_fld) {
    this.ds._httpRequest("getgroupmessages/", {data: {gid: groupid_fld}}, 1).subscribe(dt => {
      dt = dt
      this.chats = dt.payload
      console.log(dt)
    }, (er) =>{
      er = er.error
      this.chats = []
    })
  }

  isMobile(){
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width < 769;
  }

  openGroupChat(data, index) : void {
    const x = document.getElementsByClassName("groupmessages__container")[0] as HTMLElement; //('')
    const y = document.getElementsByClassName("groups__container")[0] as HTMLElement; //('')
    this.showGroupMembers = false;
    this.chatBody(data, index);
    if(this.isMobile()){
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

  searchInput: string = '';
  timer: any;              // Timer identifier
  waitTime: number = 500;   // Wait time in milliseconds 

  public search(){
    if (this.searchInput === ''){
      this.grouparray = this.backupGroupArray;
    }
    // Clear timer
    clearTimeout(this.timer);

    // Wait for X ms and then process the request
    this.timer = setTimeout(() => {
      this.searchGroups(this.searchInput);
    }, this.waitTime);
  }

  public searchGroups(searchInput: string){
    this.grouparray = this.grouparray.filter(item => {
        return (item.groupname_fld.toUpperCase().includes(searchInput.toString().toUpperCase())); 
    })
  }
}