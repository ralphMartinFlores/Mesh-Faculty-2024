import { Component, OnInit } from '@angular/core';
import { CreateGroupComponent } from './create-group/create-group.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-group-messaging',
  templateUrl: './group-messaging.component.html',
  styleUrls: ['./group-messaging.component.scss']
})
export class GroupMessagingComponent implements OnInit {

  public grouparray = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];

  constructor(public _dialog: MatDialog) { }

  ngOnInit(): void {
  }

  // createGroupDialog() {
  //   const dialogConfig = new MatDialogConfig();
  //   this._dialog.open(CreateGroupComponent, dialogConfig {
  //     maxHeight: '80vh'
  //   });
  // }

  public createGroupDialog (): void {
    let dialogRef = this._dialog.open(CreateGroupComponent, {
      maxHeight: "85vh",
      maxWidth: "90vw"
    });

    dialogRef.afterClosed().subscribe(participant => {
      // console.log('closed');
    });

  }

}
