import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
// import { ChatService } from 'src/app/services/chat.service';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss']
})
export class MessagingComponent implements OnInit, OnDestroy {

  message: string = '';
  url = this.route.url.split('/');
  classcode = this.url[3];
  rooms = [];
  selectedRoom = '';
  roomMessages = [];
  private unSubscribe = new Subject()
  messageForms: FormGroup;
  webSocket: WebSocket;
  selectedIndex: number = null;
  unreadMessages = []

  private scrollContainer: any;

  @ViewChild('scrollframe') private scrollFrame: ElementRef;

  // @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  @ViewChild('target') private myScrollContainer: ElementRef;

  activeMessage: {};


  scrollToElement(el) {
    this.myScrollContainer.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }


  constructor( public ds: DataService, public user: UserService, private route: Router,
    private fb: FormBuilder,) { }


  ngOnInit(): void {
    // this.chat.getMessages().subscribe((res: any) => {
    //   this.isMessageMine(res)
    // })
    this.getUnread();
    
    this.messageForms = this.fb.group({
      usermassage: ['', Validators.required],
    });
  }


  ngAfterViewInit() {
    try {
      this.scrollContainer = this.scrollFrame.nativeElement;
    } catch (error) {
      error
    }

  }

  ngOnDestroy(): void {
    this.unSubscribe.unsubscribe()
  }

  isMessageMine(dt) {

    if (dt.receiver == this.user.getUserID() && dt.classcode == this.classcode && dt.sender == this.selectedRoom['id']) {
      this.roomMessages.push(dt['data'])
      setTimeout(() => {
        this.myScrollContainer.nativeElement.scroll({
          top: this.myScrollContainer.nativeElement.scrollHeight,
          left: 0,
          behavior: 'smooth'
        });

      }, 200);
    }
    else {

    }
  }

  getRooms() {
    this.ds._httpRequest('getmembers', { data: { classcode: this.classcode, acadyear: this.user.getSettings().acadyear_fld, semester: this.user.getSettings().sem_fld } }, 1).subscribe(async (res: any) => {
      const result = await this.user._decrypt(res.a)
      console.log(result.payload)
      this.rooms = await this.setRoom(result.payload);
    }, er => {
      er = this.user._decrypt(er.error.a)
    })
  }

  setRoom(data: any) {
    const student = data.student;
    const instructor = data.instructor;
    const socketid = [];
    const tempRoom = [];

    // instructor.forEach(element => {
    //   tempRoom.push({
    //     socketid: element.socketid_fld,
    //     id: element.empcode_fld,
    //     fullname: element.fname_fld +' '+ element.lname_fld,
    //     image: element.profilepic_fld
    //   })
    // });

    student.forEach(element => {
      tempRoom.push(
        {
          id: element.studnum_fld,
          fullname: `${element.lname_fld}, ${element.fname_fld}`,
          image: element.profilepic_fld,
          unread: +this.getUnreadCount(element.studnum_fld)
        }
      )
    });

    function compare( a, b ) {
      if ( a.unread > b.unread ){
        return -1;
      }
      if ( a.unread < b.unread ){
        return 1;
      }
      return 0;
    }
    tempRoom.sort(compare)
   
    return tempRoom;
  }

  async chatBody(e, i) {
    this.selectedRoom = e;
    this.rooms[i].unread = ''
    this.activeMessage = e;
    this.roomMessages = [];
    this.getMessage(e);

    this.unreadMessages.forEach(message => {
      if(message.roommember_fld.toString().includes(e.id.toString())){
        this.ds._httpRequest("readmsg", { roomcode: this.classcode, recipient: this.user.getUserID(), authorid: e.id }, 1).subscribe(async (res:any) => {
          const data = await this.user._decrypt(res.a);
          this.unreadMessages = data.payload
          this.user.setMessageBadge(this.unreadMessages.length)
        },async (er:any) => {
          const err = await this.user._decrypt(er.error.a);
          this.user.setMessageBadge('')
          if(err.status.message == "No data found") {
            this.unreadMessages = [];
          }
        })
      }
    })
  }

  sendChat(el) {
    if (this.messageForms.invalid) return;
    const load = {
      authorid_fld: this.user.getUserID(),
      content_fld: this.messageForms.value.usermassage,
      roomcode_fld: this.classcode,
      roommember_fld: `${this.user.getUserID()} - ${this.selectedRoom['id']}`
    }
    this.ds._httpRequest('addmsg', load, 1).subscribe(async (res: any) => {
      const result = await this.user._decrypt(res.a)
      this.roomMessages.push(result.payload[0]);
      // this.chat.sendMessage({ type: "message", classcode: this.classcode, receiver: this.selectedRoom['id'], sender: this.user.getUserID(), data: result.payload[0] });
      this.messageForms.reset();
    }, er => {

    })


    setTimeout(() => {
      this.myScrollContainer.nativeElement.scroll({
        top: this.myScrollContainer.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    }, 200);

  }

  getMessage(e) {
    this.user.setLoading(true);
    this.ds._httpRequest('getmsg', { roomcode: this.classcode, sender: this.user.getUserID(), receiver: e.id }, 1).subscribe(async (res: any) => {
      const result = this.user._decrypt(res.a);
      this.roomMessages = await result.payload;
      setTimeout(() => {
        this.myScrollContainer.nativeElement.scroll({
          top: this.myScrollContainer.nativeElement.scrollHeight,
          left: 0,
        });
      }, 50);
      this.user.setLoading(false);
    }, err => {
      err = this.user._decrypt(err.error.a);
      this.roomMessages = [];
      this.user.setLoading(false);
    })
  }

  getErrorMessage() {
    if (this.messageForms.controls.usermassage.hasError('required')) return 'You must enter a value';
  }

  scrollToBottom() {
    var element = document.getElementById("page");
    element.scrollIntoView();
  }

  getUnread() {
    this.ds._httpRequest('getunread', { roomcode: this.classcode, recipient: this.user.getUserID() }, 1).subscribe(async(res:any) => {
      const data = await this.user._decrypt(res.a);
      this.unreadMessages = await data.payload;
      this.getRooms();

    
    }, async er => {
      er = await this.user._decrypt(er.error.a)
     
      this.getRooms();

    })

  }

  getUnreadCount(id){
    let count = 0
    this.unreadMessages.forEach(element => {
      if(element.authorid_fld == id){ count += 1}
    });
    return count
  }



}
