import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MediaService } from 'src/app/services/media.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements AfterViewInit, OnInit {
  @ViewChild('videoPlayer') videoElement?: any;
  @Input() mode: 'view' | 'owner' = 'view';
  @Input() stream: MediaStream;
  @Input() userPeerId: any;
  @Input() participants: any;
  @Input() recordedVideo: ElementRef;
  public micIconSrc: string;
  public webCamIconSrc: string;
  public screenIconSrc: string;
  public videoElementRef: any;
  public displayName: string;

  constructor(
    private mediaService: MediaService,
    private socketService: SocketService) { }

  ngOnInit(): void {
    this.displayName = '';
    this.mediaService.mode = this.mode;
    this.micIconSrc = this.mediaService.getMicSrc();
    this.webCamIconSrc = this.mediaService.getWebcamSrc();
    this.screenIconSrc = this.mediaService.getScreenSrc();
  }

  async ngAfterViewInit(): Promise<void> {
    this.videoElementRef = await this.videoElement.nativeElement;
    if (this.mode === 'owner') {
      this.displayName = 'You';
      this.videoElementRef.muted = true;
      this.videoElementRef.src = (this.recordedVideo) ? this.recordedVideo : null;
    } else {
      for(let i = 0; i < this.participants.length; i++) {
        if(this.participants[i].peerId === this.userPeerId) {
            this.displayName = this.participants[i].name;
            break;
        }
    }
    }
    this.playVideo();
    this.listenMediaControlChanges();
  }
  
  private listenMediaControlChanges(): void {
    this.mediaService.isMute.subscribe(() => {
      this.micIconSrc = this.mediaService.getMicSrc();
    })
    this.mediaService.isCameraOff.subscribe(() => {
      this.webCamIconSrc = this.mediaService.getWebcamSrc();
    })
  }

  private playVideo() {
    if(this.stream) {
      this.videoElementRef.srcObject = this.stream;
      this.videoElementRef.play();

      this.socketService.USER_ID.subscribe(userId => {
        if (userId != null) {
          if (userId === this.userPeerId) {
            this.videoElementRef.style.display = 'none';
          }
        }
         else {
          this.videoElementRef.style.display = 'block';
        }
      })

    } else {
      this.videoElementRef.srcObject = null;
      this.videoElementRef.pause();
      this.videoElementRef.removeAttribute('srcObject');
      this.videoElementRef.load();
    }
  }
}
