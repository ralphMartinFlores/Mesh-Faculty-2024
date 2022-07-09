import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MediaIconUrl } from '../shared/data/media-icon';
@Injectable({
  providedIn: 'root'
})
export class MediaService {
  public stream: MediaStream;
  public isMute = new BehaviorSubject(false);
  public isCameraOff = new BehaviorSubject(false);
  public isScreeShareOn = new BehaviorSubject(false);
  public mode: 'view' | 'owner' = 'view';

  public muteOrUnMute(isMute): void {
    if (this.stream) {
      this.isMute.next(!this.isMute.getValue());
      this.stream.getAudioTracks()[0].enabled = isMute;
    }
  }
  
  public turnVideoOnOrOff(isCameraOff): void {
    if (this.stream) {
      this.isCameraOff.next(!this.isCameraOff.getValue());
      this.stream.getVideoTracks()[0].enabled = isCameraOff;
    }
  }

  public getMicSrc(): string {
      return this.isMute.getValue() ? MediaIconUrl.micMuteIconUrl : MediaIconUrl.micIconUrl;
    // return this.isMute.getValue() ? MediaIconUrl.soundOffIconUrl : MediaIconUrl.soundIconUrl;
  }

  public getWebcamSrc(): string {
    return this.isCameraOff.getValue() ? MediaIconUrl.cameraOffIconUrl : MediaIconUrl.cameraIconUrl;
  }

  public getScreenSrc(): string {
    return this.isScreeShareOn.getValue() ? MediaIconUrl.shareScreen : MediaIconUrl.shareScreen;
  }
}
