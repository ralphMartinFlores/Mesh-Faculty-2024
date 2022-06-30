import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import io, { Socket } from 'socket.io-client';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public newMessage = new BehaviorSubject(null);
  public socket: Socket;

  public participantsList = new BehaviorSubject(null);

  constructor(private _user: UserService) {
    // this.socket = io('https://gordoncollegeccs.edu.ph:4233/', { path: '/socket' }); //https://live.datnikon.com/
    this.socket = io('http://localhost:4230/', { path: '/socket' }); //https://live.datnikon.com/
    this.handleNewMessage();
  }

   public joinRoom(roomId: string, name: string, id: string): void {
    this.socket.emit('join-room', roomId, name, id);
  }

  public disconnectToMeeting() {
    this.socket.disconnect()
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
}
