import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import transform, { SessionDescription } from 'sdp-transform';

declare var Peer: any;
export interface CallUser {
  peerId: string;
  stream: MediaStream;
}
@Injectable()
export class PeerService {
  public peer;
  public myPeerId: string;
  public joinUser = new BehaviorSubject<CallUser>(null);
  public leaveUser = new BehaviorSubject<string>(null);
  public localStream: MediaStream;
  public lazyStream: MediaStream;
  public currentPeer: any[] = [];
  private peerList: Array<any> = [];

  constructor(private http: HttpClient) { }


  getTurnServeConfig(): any {
    // return ({
    //   "iceServers": [
    //     {
    //         "url": "stun:ws-turn5.xirsys.com"
    //     },
    //     {
    //         "username": "CX2xc_x5xTumd-BquXpwmudtch5oSSMB1SnF30axAbc1Sq1KI-TyhBrw8DAH2C-3AAAAAGKRonpqZXJ6aWxsYQ==",
    //         "url": "turn:ws-turn5.xirsys.com:80?transport=udp",
    //         "credential": "2a7d25c4-de3d-11ec-a394-0242ac140004"
    //     }
    //   ]
    // })
    // return this.http.put('https://global.xirsys.net/_turn/MyFirstApp', null,
    //   {
    //     headers: new HttpHeaders(
    //       { "Authorization": "Basic " + btoa("datnikon:f0f2a8b6-b7f9-11eb-9b35-0242ac150003") }
    //     )
    // })
  }


  public openPeer(stream: MediaStream): Promise<string> {
    return new Promise<string>((resolve) => {
      console.log(this.getTurnServeConfig())
        this.initPeer('asdasd');
        this.peer.on('open', (userPeerId: string) => {
          this.myPeerId = userPeerId
          this.handleInComingCall(stream);
          resolve(userPeerId);
        })
    });
  }

  public call(anotherPeerId: string, stream: MediaStream): void {
    var call = this.peer.call(anotherPeerId, stream, {sdpTransform:(sdp) => {
      sdp = this.transformSdp(sdp)
      console.log(sdp)
      return sdp
    }});
    this.lazyStream = stream;
    this.handelCall(call, anotherPeerId);
  }

  private transformSdp = (sdp): any => {
    const parsed = transform.parse(sdp)
    console.log(parsed)

    parsed.media.forEach(media => {
      if (media.type === 'audio') {
        this.transformAudio(media)
      }

      if (media.type === 'video') {
        this.transformVideo(media)
      }
    });

    return transform.write(parsed)
  }

  private getPayloads = (payloads: string | undefined, codecs: number[]) => {
    return payloads
      ?.split(' ')
      .filter(value => codecs.includes(+value))
      .join(' ');
  };
  
  private transformAudio = (media: SessionDescription['media'][0]): void => {
    /*
     * 111 - opus 48000, encoding - 2
     * 103 - isac 16000
     * 63 - red 48000, encoding - 2
     */
  
    const audioCodecs = [111, 103, 63];
  
    media.payloads = this.getPayloads(media.payloads, audioCodecs);
    media.rtp = media.rtp.filter(({ payload }) => audioCodecs.includes(payload));
  };
  
  private transformVideo = (media: SessionDescription['media'][0]): void => {
    /*
     * 96 - VP8
     * 98 - VP9
     * 102 - H264
     */
    const videoCodecs = [123];
    
    let mediaPayloads = media.payloads;
    const payloadIndex = mediaPayloads.split(' ').findIndex(value => videoCodecs.includes(+value))
    mediaPayloads = mediaPayloads.split(' ')
    media.payloads = this.swapItemsInList(mediaPayloads, mediaPayloads[payloadIndex], mediaPayloads[0]).join(' ')

    
    const rtpIndex = media.rtp.findIndex(object => object.payload === videoCodecs[0])
    media.rtp = this.swapItemsInList(media.rtp, media.rtp[rtpIndex], media.rtp[0])

    
    const rtcpFbIndex = media.rtcpFb.findIndex(object => object.payload === videoCodecs[0])
    media.rtcpFb = this.swapItemsInList(media.rtcpFb, media.rtcpFb[rtcpFbIndex], media.rtcpFb[0])

    const fmtpIndex = media.fmtp.findIndex(object => object.payload === videoCodecs[0])
    media.fmtp = this.swapItemsInList(media.fmtp, media.fmtp[fmtpIndex], media.fmtp[0])
  
  
    // media.rtp = media.rtp.filter(({ payload }) => videoCodecs.includes(payload));
    // media.rtcpFb = media.rtcpFb?.filter(({ payload }) => videoCodecs.includes(payload));
    // media.fmtp = media.fmtp.filter(({ config }) => videoCodecs.includes(Number(config.split('=')[1])));
  };

  private swapItemsInList = (list, a, b): any => {
    let copy = list.slice();
    
    copy[list.indexOf(a)] = b;
    copy[list.indexOf(b)] = a;
      
    return copy
  }

  peers: any = {};
  public handelCall(call: any, anotherPeerId: string): void {
    call.on('stream', (anotherStream: any) => {
      if (!this.peerList.includes(call.peer)) {
        this.currentPeer.push(call.peerConnection);
        this.peerList.push(call.peer);
      }
      
      call.on('close', () => {
        call.close();
      })

      this.joinUser.next({ peerId: anotherPeerId, stream: anotherStream});
    })
    
  }

  private handleInComingCall(stream: MediaStream): void {
    this.peer.on('call', call => {
      this.lazyStream = stream
      call.answer(stream, {sdpTransform:(sdp) => {
        sdp = this.transformSdp(sdp)
        return sdp
      }});
      call.on('stream', (anotherStream: any) => {
        this.joinUser.next({ peerId: call.peer, stream: anotherStream});
        if (!this.peerList.includes(call.peer)) {
          this.currentPeer.push(call.peerConnection);
          this.peerList.push(call.peer);
        }
      })
    })
  }

  private initPeer(config: any): void {
    this.peer = new Peer(this.myPeerId, {
      host: 'gordoncollegeccs.edu.ph',
      port: '4234',
      secure: true,
      config: {
        "iceServers": [
          {
              "url": "stun:ss-turn1.xirsys.com"
          },
          {
              "username": "4Bniw1xSGROiXEb7CQAekvgwRPN4k7fW0aRIo97vaAJEalwSkgetLboNOhhGXrO9AAAAAGKaHHZzZWZwdXNpbmcxOTk1",
              "url": "turn:ss-turn1.xirsys.com:80?transport=udp",
              "credential": "93d1f204-e34a-11ec-8b8b-0242ac140004"
          },
          {
              "username": "4Bniw1xSGROiXEb7CQAekvgwRPN4k7fW0aRIo97vaAJEalwSkgetLboNOhhGXrO9AAAAAGKaHHZzZWZwdXNpbmcxOTk1",
              "url": "turn:ss-turn1.xirsys.com:3478?transport=udp",
              "credential": "93d1f204-e34a-11ec-8b8b-0242ac140004"
          },
          {
              "username": "4Bniw1xSGROiXEb7CQAekvgwRPN4k7fW0aRIo97vaAJEalwSkgetLboNOhhGXrO9AAAAAGKaHHZzZWZwdXNpbmcxOTk1",
              "url": "turn:ss-turn1.xirsys.com:80?transport=tcp",
              "credential": "93d1f204-e34a-11ec-8b8b-0242ac140004"
          },
          {
              "username": "4Bniw1xSGROiXEb7CQAekvgwRPN4k7fW0aRIo97vaAJEalwSkgetLboNOhhGXrO9AAAAAGKaHHZzZWZwdXNpbmcxOTk1",
              "url": "turn:ss-turn1.xirsys.com:3478?transport=tcp",
              "credential": "93d1f204-e34a-11ec-8b8b-0242ac140004"
          },
          {
              "username": "4Bniw1xSGROiXEb7CQAekvgwRPN4k7fW0aRIo97vaAJEalwSkgetLboNOhhGXrO9AAAAAGKaHHZzZWZwdXNpbmcxOTk1",
              "url": "turns:ss-turn1.xirsys.com:443?transport=tcp",
              "credential": "93d1f204-e34a-11ec-8b8b-0242ac140004"
          },
          {
              "username": "4Bniw1xSGROiXEb7CQAekvgwRPN4k7fW0aRIo97vaAJEalwSkgetLboNOhhGXrO9AAAAAGKaHHZzZWZwdXNpbmcxOTk1",
              "url": "turns:ss-turn1.xirsys.com:5349?transport=tcp",
              "credential": "93d1f204-e34a-11ec-8b8b-0242ac140004"
          }
        ]
      }
    });
    
    // this.peer = new Peer(this.myPeerId, {
    //   host: 'localhost',
    //   port: '3001',
    //   secure: false,
    //   config: {
    //     "iceServers": [
    //       {
    //         urls:['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
    //       }
    //     ]
    //   }
    // });
  }

}
