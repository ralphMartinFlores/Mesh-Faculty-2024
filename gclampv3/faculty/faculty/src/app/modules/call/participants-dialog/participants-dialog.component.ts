import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-participants-dialog',
  templateUrl: './participants-dialog.component.html',
  styleUrls: ['./participants-dialog.component.scss']
})
export class ParticipantsDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ParticipantsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  participants: any [] = []
  myPeerId : any;

  ngOnInit(): void {
    console.log(this.data);
    this.participants = this.data[0];
    this.myPeerId = this.data[2]
  }

  dialogClose(){
    this.dialogRef.close()
  }


  searchInput: string = '';

  timer: any;              // Timer identifier
  waitTime: number = 500;   // Wait time in milliseconds 

  public search(){
    if (this.searchInput === ''){
      this.participants = this.data[0];
    }
    // Clear timer
    clearTimeout(this.timer);

    // Wait for X ms and then process the request
    this.timer = setTimeout(() => {
      this.searchParticipants(this.searchInput);
    }, this.waitTime);
  }


  // 0 unmute ..
  // 1 mute ..
  isMute: boolean;
  muteParticipant(participantPeerId: any): void{
      console.log("participantPeerId", participantPeerId);
      this.data[1].forceMuteUnmute(participantPeerId, false);
      this.isMute = false
  }

  unmuteParticipant(participantPeerId: any): void{
    console.log("participantPeerId", participantPeerId);
    this.data[1].forceMuteUnmute(participantPeerId, true);
    this.isMute = true
  }

  public searchParticipants(searchInput: string){
    this.participants = this.participants.filter(item => {
        return (item.name.toUpperCase().includes(searchInput.toString().toUpperCase())); 
    })
  }

}
