import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-call-settings',
  templateUrl: './call-settings.component.html',
  styleUrls: ['./call-settings.component.scss']
})
export class CallSettingsComponent implements OnInit { 
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  @ViewChild('cameraSelectElement') cameraSelectElement?: ElementRef;
  public cameraSelectElementRef: any;
  @ViewChild('micSelectElement') micSelectElement?: ElementRef;

  public micSelectElementRef: any;
  public globalstream: any;
  public videoElement: any;
  public audioInputSelect : any;
  public videoSelect: any;
  public selectors : any;
  public userMediaDevices: any[] = [];

  defaultPrefSwitch: any = {
    video: true,
    audio: true
  }

  cameraColorToggle: boolean = true;
  changeCameraColor() {
    this.cameraColorToggle = !this.cameraColorToggle
  }

  micColorToggle: boolean = true;
  changeMicColor() {
    this.micColorToggle = !this.micColorToggle
  }

  constructor(
    private observer: BreakpointObserver,
    public _dialog: MatDialog,
    private _ds: DataService,
    private _router: Router,
    private socketService: SocketService,
    private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute) { }

  async ngOnInit() {
    this.selectors = [this.cameraSelectElementRef, this.micSelectElementRef];

    sessionStorage.setItem("Devices", JSON.stringify(this.defaultPrefSwitch));
  }

  async ngAfterViewInit() {

    this.cameraSelectElementRef = await this.cameraSelectElement.nativeElement;
    this.micSelectElementRef = await this.micSelectElement.nativeElement;
    this.selectors = await [this.cameraSelectElementRef, this.micSelectElementRef];


    // Observes for breakpoint changes and changes sidenav mode to be more responsive
    this.observer
      .observe(["(max-width: 800px)"])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = "over";
          this.sidenav.close();
        } else {
          this.sidenav.mode = "side";
          this.sidenav.open();
        }
      });

    this.selectors.forEach(select => {
      select.addEventListener('change', (event) => {
        this.detectDevices();
      });
    });

    if (!this.globalstream) {
      this.start();
    }

    // this.camOffElementRef.style.display = 'none';
  }

  gotDevices(deviceInfos) {
    // Handles being called several times to update labels. Preserve values.
    const values = this.selectors.map((select) => select.value);
    this.selectors.forEach((select) => {
      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }
    });
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      const option = document.createElement("option");
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === "audioinput") {
        option.text =
          deviceInfo.label || `microphone ${this.audioInputSelect.length + 1}`;
        this.micSelectElementRef.appendChild(option);
      } else if (deviceInfo.kind === "videoinput") {
        option.text = deviceInfo.label || `camera ${this.videoSelect.length + 1}`;
        this.cameraSelectElementRef.appendChild(option);
      }
    }
    this.selectors.forEach((select, selectorIndex) => {
      if (
        Array.prototype.slice
          .call(select.childNodes)
          .some((n) => n.value === values[selectorIndex])
      ) {
        select.value = values[selectorIndex];
      }
    });
  }

  gotStream(stream) {
    this.globalstream = stream; // make stream available to console
    // this.previewVideoElementRef.srcObject = stream;
    // Refresh button list in case labels have become available
    return navigator.mediaDevices.enumerateDevices();
  }

  detectDevices() {
    const trackItem = this.globalstream.getTracks().find(track => track.kind === 'video');
    const trackItem2 = this.globalstream.getTracks().find(track => track.kind === 'video');
    // this.videoSwitch = true;
    // this.micSwitch = true;

    if (trackItem.enabled || trackItem2.enabled) {
      trackItem.enabled = true;
      this.defaultPrefSwitch.video = true;
      this.defaultPrefSwitch.audio = true;
    }
    this.start();
  }

  async start() {
    this.cameraColorToggle = true;
    this.micColorToggle = true;
    const audioSource = this.micSelectElementRef.value;
    const videoSource = this.cameraSelectElementRef.value;
    const constraints = {
      audio: { 
        deviceId: audioSource ? { exact: audioSource } : undefined 
      },
      video: { 
        deviceId: videoSource ? { exact: videoSource } : undefined,
        width: { exact: 480 },
        height: { exact: 360 },
        frameRate: { min: 10, max: 30 },  
      },
    };

    window.sessionStorage.setItem("pref", JSON.stringify(constraints));

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const devices = await this.gotStream(stream);

    this.gotDevices(devices);

    // Determine if video is currently enabled and apply camera status
    const videoTrackItem = stream.getTracks().find(track => track.kind === 'video')
    if (videoTrackItem.enabled) {
      // this.camOffElementRef.style.display = 'none';
    } else {
      // this.camOffElementRef.style.display = 'block';
    }

    const videoTrackItem1 = stream.getTracks().find(track => track.kind === 'video').getSettings();
    // this.stream_height = videoTrackItem1.height;
  }

  joinCall() {
    sessionStorage.setItem("Devices", JSON.stringify(this.defaultPrefSwitch));
    let data = JSON.parse(window.sessionStorage.getItem('pref'));
    if (Object.keys(data.audio).length && Object.keys(data.video).length != 0){
      this._dialog.closeAll()
      this._router.navigate(['/main/call/'])
    } else {
      this._displaySnackBar(
        "Please check your audio and video set-up",
        "",
        "warning",
        "bottom"
      );
    }
  }

  _displaySnackBar = (
    message: string,
    action: string,
    pc: string,
    pos: any
  ): any =>
    this._snackBar.open(message, action, {
      panelClass: pc,
      verticalPosition: pos,
      duration: 3000,
  });
}
