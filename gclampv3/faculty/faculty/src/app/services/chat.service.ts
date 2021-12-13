import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  webSocket: WebSocket;
  messageArray= []
  url = 'ws://localhost:8081/chat';
  constructor() {
      // this.webSocket = new WebSocket(this.url);
   }

//   public openWebSocket(){

//     this.webSocket.onopen = (event) => {
//       console.log('Open', event);
//     }
  
//   }

//   public getMessages = () => {
//     return new Observable<any>( observer =>{
//       this.webSocket.onmessage = (event) =>{
//         const message = JSON.parse(event.data)
//         observer.next(message);
//       }
//     } )
// }

//   public sendMessage(data){
//     this.webSocket.send(unescape(encodeURIComponent(JSON.stringify(data))));
//   }

//   public closeWebsocket(){
//     this.webSocket.close();
//   }

}
