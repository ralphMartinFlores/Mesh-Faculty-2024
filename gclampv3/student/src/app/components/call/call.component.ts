import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
import { MediaService } from 'src/app/services/media.service';
import { CallUser, PeerService } from 'src/app/services/peer.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import Utils from 'src/app/shared/utils/utils';
import { CallSettingsComponent } from './call-settings/call-settings.component';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss']
})
export class CallComponent implements OnInit {

  @ViewChild('videoElementContainer') videoElementContainer?: ElementRef;
  @ViewChild('videoElement') videoElement?: ElementRef;
  @ViewChild('buttonElement', { read: ElementRef }) buttonElement?: ElementRef;
  @ViewChild('videoTilesElementContainer') videoTilesElementContainer?: ElementRef;
  @ViewChild('participantTilesElementContainer') participantTilesElementContainer?: ElementRef;
  @ViewChild('stackFlexContainer') stackFlexContainer?: ElementRef;
  @ViewChild('shareAndMembersContainer') shareAndMembersContainer?: ElementRef;

  p: number = 1;
  itp: number;
  public videoarray = [1,1,1,1,1,1,1,1,1,1,1,1,1];

  public videoElementContainerRef: any;
  public videoElementRef: any;
  public buttonElementRef: any;
  public videoTilesElementContainerRef: any;
  public participantTilesElementContainerRef: any;
  public stackFlexContainerRef: any;
  public shareAndMembersContainerRef: any;

  public joinedUsers: CallUser[] = [];
  public localStream: MediaStream;
  public screenStream: MediaStream;
  public roomId: string = '';
  public myPeerId: string = '';
  public isHideChat = true;
  public micIconSrc: string;
  public webCamIconSrc: string;
  showShareScreen:boolean = true;
  showCamera:boolean = true;
  showMicrophone:boolean = true;

  public icon = 'screen_share';

  public changeIcon(newIcon: string ){
    this.icon = newIcon ;
  }


  // Variables needed for a responsive sidenav
  @ViewChild(MatDrawer)
  drawer!: MatDrawer;
  datetime: Date;

  constructor(public _dialog: MatDialog,
    private socketService: SocketService,
    private peerService: PeerService,
    public router: Router,
    public dialog: MatDialog,
    private mediaService: MediaService,
    private _ds: DataService,
    private observer: BreakpointObserver,
    private user: UserService) { }

  public callSettingsDialog (): void {
    let dialogRef = this._dialog.open(CallSettingsComponent, {
      maxHeight: "85vh",
      maxWidth: "90vw"
    });
  }

  async ngAfterViewInit(): Promise<void> {
    this.videoElementContainerRef = this.videoElementContainer.nativeElement;
    this.videoElementRef = this.videoElement.nativeElement;
    // this.buttonElementRef = this.buttonElement.nativeElement;
    this.videoTilesElementContainerRef = this.videoTilesElementContainer.nativeElement;
    this.shareAndMembersContainerRef = this.shareAndMembersContainer.nativeElement;
    this.participantTilesElementContainerRef = this.participantTilesElementContainer.nativeElement;
    console.log(this.shareAndMembersContainerRef);
    console.log(this.participantTilesElementContainerRef);

    await this.listenNewUser();
    await this.participantsList();
    await this.listenMuteUmuteUsers();


    this.listenLeavedUser();
    this.detectScreenWith();
    // this.listenMediaControlChanges();

    let pref = JSON.parse(window.sessionStorage.getItem('pref'))
    if (pref){
     if (!pref.video.deviceId && !pref.video.deviceId){
      this.router.navigate(['/settings']);
      }
    }
  }

  ngOnInit(): void {
    this.observer
      .observe(['(max-width: 1200px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.drawer.mode = 'over';
          this.drawer.close();
        } else {
          this.drawer.mode = 'side';
          this.drawer.open();
        }
      });

    this.micIconSrc = this.mediaService.getMicSrc();
    this.webCamIconSrc = this.mediaService.getWebcamSrc();
    this.roomId = window.sessionStorage.getItem('roomId');

    Utils.getMediaStream({ video: true, audio: true }).then(stream => {
      this.localStream = stream;
      this.mediaService.stream = this.localStream;
      this.openPeer(this.localStream);
    })

    this.itp = 12;
  }
  
  public muteOrUnMute(): void {
    this.showMicrophone = !this.showMicrophone;
    this.mediaService.muteOrUnMute(this.showMicrophone);
  }

  public async turnVideoOnOrOff(): Promise<void> {
    this.showCamera = !this.showCamera;
    // console.log('SHOW CAMERA ', this.showCamera)
    await this.mediaService.turnVideoOnOrOff(this.showCamera);
  }

  hideOrUnhideChat(): void {
    this.isHideChat = !this.isHideChat;
  }

  private detectScreenWith(): void {
    if (window.screen.width > 719) {
      setTimeout(() => {
        this.isHideChat = false;
      }, 200);
    }
  }

  private listenNewUser(): void {
    this.listenNewUserJoinRoom();
    this.listenNewUserStream();
  }

  private listenLeavedUser(): void {
    this.socketService.leavedId.subscribe(async userPeerId => {
      this.joinedUsers = this.joinedUsers.filter(x => x.peerId != userPeerId);
    })
  }

  isForceMute: boolean = false;
  private listenMuteUmuteUsers  = async () =>{
    this.socketService.forceMuteUnmuteAction.subscribe( async muteHandler => {
      console.log('muteHandler', muteHandler);
      if (muteHandler) {

        if (muteHandler.peerId == this.myPeerId){
          this.mediaService.muteOrUnMute(muteHandler.actionStatus);

          this.showMicrophone = muteHandler.actionStatus;
        }

      }
    })
  }

  public participants: any [] = [];
  public joinUserInfo: any= {};
  remoteUsers: any  [] = [];

  numberOfParticipants: number =  1;

  private listenNewUserJoinRoom(): void {
    this.socketService.joinedId.subscribe(async newUserId => {
      if (newUserId) {
        const { name, userId, id } = newUserId
        this.makeCall(userId, this.localStream);

        this.participants.push({
          name: await newUserId['name'],
          peerId: await newUserId['userId'],
          userId: await newUserId['id']
         });

         this.participants = this.getUniqueListBy(this.participants, `peerId`)
         this.numberOfParticipants = this.participants.length;

        this.socketService.participants(this.participants);
      }
    })
  }

  private participantsList  = async () => {
    this.socketService.participantsList.subscribe(async participant => {
      if (participant) {
       this.participants = await participant;
       this.numberOfParticipants = this.participants.length;
       console.log('participants', this.participants);
      }
    })
  }

  public getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  private listenNewUserStream(): void {
    this.peerService.joinUser.subscribe(user => {
      if (user) {
        if (this.joinedUsers.findIndex(u => u.peerId === user.peerId) < 0) {
          this.joinedUsers.push(user);
        }
      }
    })
  }

  private openPeer(localStream: MediaStream): void {
    this.peerService.openPeer(localStream).then((myPeerId) => {
      this.myPeerId = myPeerId;
      console.log('MY PEER ID: ', myPeerId)
      this.joinRoom(this.roomId, myPeerId);
    })
  }

  private makeCall(anotherPeerId: string, localStream: MediaStream): void {
    this.peerService.call(anotherPeerId, localStream);
  }

  private joinRoom(roomId: string, userPeerId: string): void {
    let name:string = this.user.getFullname()
    let id:string = this.user.getUserID()
    this.socketService.joinRoom(roomId, userPeerId, name, id);
  }

  public convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  }

  student_info : any = {};
  public endCall = (): void => {
    const classcode = this.user.getSelectedClass().classcode_fld
    this.socketService.disconnectToMeeting()

    const listToRemove: string[] = ['recno_fld', 'Devices', 'checkHost', 'hostControls', 'pref', 'meetLink', 'sharerPeerId'];
    listToRemove.forEach(item => sessionStorage.removeItem(item));

    this.router.navigate([`/main/classes/${classcode}`]).then(() => {
      window.location.reload();
    })

  }

  public checkPeerIdIfExist(myPeerId: any): any{
    return this.participants.filter(item => {
      return (item.peerId.includes(myPeerId.toString()));
    })
  }

}
