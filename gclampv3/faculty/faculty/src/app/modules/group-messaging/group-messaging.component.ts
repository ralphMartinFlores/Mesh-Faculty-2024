import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateGroupComponent } from './create-group/create-group.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { SocketService } from 'src/app/services/socket.service';
import { CallSettingsComponent } from '../call/call-settings/call-settings.component';

@Component({
  selector: 'app-group-messaging',
  templateUrl: './group-messaging.component.html',
  styleUrls: ['./group-messaging.component.scss']
})



export class GroupMessagingComponent implements OnInit, AfterViewInit {

  // @HostListener('window:resize', ['$event'])
  
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
  show:boolean;

  filter: any;
  @ViewChild('scrollTarget') private myScrollContainer: ElementRef;
  @ViewChild('scrollframe') private scrollFrame: ElementRef;
  @ViewChild('emptyContainerElement') emptyContainerElement?: ElementRef;
  @ViewChild('emptySearchContainerElement') emptySearchContainerElement?: ElementRef;
  @ViewChild('noSelectedConversationElement') noSelectedConversationElement?: ElementRef;
  @ViewChild('greetingsElement') greetingsElement?: ElementRef;
  @ViewChild('groupsContainer') groupsContainer?: ElementRef;
  @ViewChild('groupmessagesContainer') groupmessagesContainer?: ElementRef;
  
  public emptyContainerElementRef: any;
  public emptySearchContainerElementRef: any
  public noSelectedConversationElementRef: any;
  public greetingsElementRef: any;
  public groupsContainerRef: any;
  public groupmessagesContainerRef: any;


  
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
  
  public instructor: any;

  // End

  // pageWidth: any;

  // onResize(event?) {
  //   this.pageWidth = window.innerWidth;
  //   console.log(this.pageWidth);
  // }


  constructor(
    public ds: DataService, 
    public user: UserService, 
    private route: Router,
    private _fb: FormBuilder,
    private _dialog: MatDialog,
    public socket: SocketService,
    private router: Router
  ) { 
    // this.onResize();
  }




  ngOnInit(): void {

    this.initializeComponents();
    this.handleNewMessage()
    this.groupMessage = this._fb.group({
      messageContent: ['', Validators.required],
    });
  }

  isMobile(){
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width < 769;
  }
  ngAfterViewInit() {
    this.emptyContainerElementRef = this.emptyContainerElement.nativeElement;
    this.emptySearchContainerElementRef = this.emptySearchContainerElement.nativeElement;
    this.groupmessagesContainerRef = this.groupmessagesContainer.nativeElement;
    this.groupsContainerRef = this.groupsContainer.nativeElement;


    this.noSelectedConversationElementRef = this.noSelectedConversationElement.nativeElement;
    this.greetingsElementRef = this.greetingsElement.nativeElement;
    this.emptySearchContainerElementRef.style.display = 'none'

  }

  initializeComponents = () => {
    this.instructor = this.user.getUserData();
    this.myId = this.splitEmail(this.user.getUserEmail())
    this.getGroups();
    this.allStudents = this.user.getClassMembers().student;
    this.students = this.allStudents;
  }

  async chatBody(data, index): Promise<any> {
    this.getSavedMessages(data.groupid_fld);
    this.selectedRoom = await data
    this.groupNameisActive = await data
    this.scrollToNewMessage();
    this.joinRoom(data.groupid_fld, this.user.getUserID())
  }

  private joinRoom(roomId: string, userId: any): void {
    let name:string = this.user.getUserFullname()
    let id:string = this.user.getUserID()
    this.socket.joinRoom(roomId, userId, name, id)
  }

  handleNewMessage(): void {
    this.socket.newMessage.subscribe(message => {
      if (message && message.groupid_fld === this.selectedGroup?.groupid_fld) {
        this.chats.push(message)
        this.scrollToNewMessage();
      }
    })
  }

  call(): void{
    console.log('call has been triggered');

  }

  videocall(): void{
    window.sessionStorage.setItem('roomId', this.selectedRoom.roomid_fld)
    this.router.navigate(['/main/call'])  

  }

  addMessage(message: string): any {

    // document.getElementsByClassName("groupmessages__container")[0] as HTMLElement

    // CHORE: Revamp DOM Manipulations for animationDelay .. 
    // const element = document.getElementsByClassName("chatDivReply")[0] as HTMLElement;
    // element.style.animationDelay = "--delay: 0s"

    if (message === "") return; 
    const sender = this.splitEmail(this.user.getUserEmail())
    const time = new Date()
    const date = new Date()
    const sender_name = this.user.getUserData().fullname
    const groupId = this.selectedGroup?.groupid_fld

    this.socket.chat(groupId, message, sender, sender_name, date)
    this.chats.push({ groupid_fld: groupId, content_fld: message, sender_fld: sender, sendername_fld: sender_name, datetime_fld: date})
    // console.log(this.chats)
    this.scrollToNewMessage()
    this.saveMessage(message, time)
    this.groupMessage.reset()
  }

  public saveMessage(message: string, dateTime: any): void {
    const senderName = this.user.getUserFullname()
    const load = {
        groupid_fld: this.selectedRoom.groupid_fld,
        sender_fld: this.splitEmail(this.user.getUserEmail()),
        sendername_fld: senderName,
        content_fld: message,
        datetime_fld: dateTime
    }

    this.ds._httpRequest("addgrpmsg/", load, 1).subscribe(res => {
      let dt = this.user._decrypt(res.a)
      // DO SOMETHING
    }, (er) =>{
      er = this.user._decrypt(er.error.a)
    })
  }

  showGroupMembers: boolean = false  
  groupChatMembers: any = [];
  seegroupMembers(): void{
    const groupChatMembersId = this.selectedGroup.participants_fld.split(', ')
    const groupChatMembers: any[] = this.students.filter(student => groupChatMembersId.includes(student.studnum_fld))
    this.groupChatMembers = groupChatMembers
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
    const load = { 
      data: {
        cc: this.classcode, 
        id: this.splitEmail(this.user.getUserEmail()) 
      } 
    } 

    this.ds._httpRequest('getgroups/', load, 1).subscribe((dt: any) => {
      dt = this.user._decrypt(dt.a)
      this.grouparray = dt.payload
      this.backupGroupArray = dt.payload
      // Show Empty Illustration if there are no groups yet

      if (this.grouparray.length === 0) {
        this.noSelectedConversationElementRef.style.display = 'none';
        return;
      }

      if (this.grouparray.length > 0) {
        this.show = true;
        this.emptyContainerElementRef.style.display = 'none';

        this.greetingsElementRef.style.display = 'none';
      }
    }, er => {
      this.noSelectedConversationElementRef.style.display = 'none';
      er = this.user._decrypt(er.error.a)
    })

  }

  getSavedMessages(groupid_fld) {
    this.ds._httpRequest("getgroupmessages/", {data: {gid: groupid_fld}}, 1).subscribe(dt => {
      dt = this.user._decrypt(dt.a)
      this.chats = dt.payload;
      // console.log(this.chats)
      
    }, (er) =>{
      console.log(false)
      er = this.user._decrypt(er.error.a)
      this.chats = []
    })
  }
  
  public createGroupDialog (): void {
    let dialogRef = this._dialog.open(CreateGroupComponent, {
      maxHeight: "85vh",
      maxWidth: "90vw"
    });

    dialogRef.afterClosed().subscribe(participant => {

      if (Object.entries(this.groupNameisActive).length !== 0)
        this.noSelectedConversationElementRef.style.display = 'none';
      else
        this.noSelectedConversationElementRef.style.display = 'block';
      
      this.getGroups()
    });

  }

  public chooseDevicesDialog(): void {
    let dialogRef = this._dialog.open(CallSettingsComponent, {
      maxHeight: "85vh",
      maxWidth: "90vw"
    });
  }

  public delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  public selectedGroup: any;
  async openGroupChat(data, index) : Promise<void> {
    this.selectedGroup = data
    this.show = false;
    const x = document.getElementsByClassName("groupmessages__container")[0] as HTMLElement; //('')
    const y = document.getElementsByClassName("groups__container")[0] as HTMLElement; //('')
    this.showGroupMembers = false;
    this.chatBody(data, index);
    this.groupsContainerRef.style.display = 'none';
   
    this.groupmessagesContainerRef.style.display = 'block';
    this.noSelectedConversationElementRef.style.display = 'none'

    
  }

  onBackButton(){
    const x = document.getElementsByClassName("groupmessages__container")[0] as HTMLElement; //('')
    const y = document.getElementsByClassName("groups__container")[0] as HTMLElement; //('')
    x.style.display = "none";
    y.style.display = "block";
  }


  // async onBackToGroupButton(){

  //   if(await this.isMobile()){
  //     const x = document.getElementsByClassName("groupmessages__container")[0] as HTMLElement; //('')
  //     const y = document.getElementsByClassName("groups__container")[0] as HTMLElement; //('')
  //     x.style.display = "none";
  //     y.style.display = "block";
  //     this.emptyContainerElementRef.style.display = 'none'
  //     this.groupNameisActive = {}
  //   } else {
  //     this.selectedGroup = ''
  //     this.selectedRoom = ''
  //     this.noSelectedConversationElementRef.style.display = 'block';
  //     this.groupNameisActive = {}
  //   }   
  // }

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
    const groupNameTile = document.getElementsByClassName("groups__container--group")[0] as HTMLElement; //('')
    if (searchInput === ''){
      groupNameTile.style.display = 'block'
    } 

    this.grouparray = this.grouparray.filter(item => {
        if ((item.groupname_fld.toUpperCase().includes(searchInput.toString().toUpperCase()))){
          this.emptySearchContainerElementRef.style.display = 'none'
        } else {
          groupNameTile.style.display = 'none'
          this.emptySearchContainerElementRef.style.display = 'block'
        }
        return this.grouparray;
    })
  }
}
