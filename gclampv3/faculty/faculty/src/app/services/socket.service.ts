import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import io, { Socket } from 'socket.io-client';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public joinedId = new BehaviorSubject(null);
  public leavedId = new BehaviorSubject(null);
  public newMessage = new BehaviorSubject(null);
  public socket: Socket;
  public USER_ID = new BehaviorSubject(null);
  public forceMuteUnmuteAction = new BehaviorSubject(null);
  public participantsList = new BehaviorSubject(null);

  constructor(private _user: UserService) {
    // this.socket = io('https://gordoncollegeccs.edu.ph:4233/', { path: '/socket' }); //https://live.datnikon.com/
    this.socket = io('http://localhost:4230/', { path: '/socket' }); //https://live.datnikon.com/
    this.hanleUserConnect();
    this.handleNewMessage();
  }

  public joinRoom(roomId: string, userId: string, name: string, id: string): void {
    const peerId = null;
    this.socket.emit('join-room', roomId, peerId, name, id);
  }

  public disconnectToMeeting() {
    this.socket.emit('leave-room')
  }

  public chat(content: string, sender, sendername_fld: string, time: Date): void {
    console.log('OUTGOING: ', content, sendername_fld)
    this.socket.emit('chat', content, sender, sendername_fld, time);
  }

  public participants(participants: any): void {
    this.socket.emit('participants', participants);
  }

  private handleNewMessage(): void {
    this.socket.on('new-message', (content, sender, sendername_fld, time) => {
      let message = {content_fld: content, sender_fld: sender, sendername_fld, datetime_fld: time}
      console.log('NEW MESSAGE: ', message)
      this.newMessage.next(message);
    })
  }

  public hanleUserConnect(): void {
    this.socket.on('user-connected', (name: any, userId: any, id: any) => {
      let userInfo = {userId: userId, name: name, id: id};
      this.joinedId.next(userInfo);
      // console.log('joinedId ',this.joinedId)
    })

    this.socket.on('user-disconnected', userId => {
      this.leavedId.next(userId);
    })
  }
}
