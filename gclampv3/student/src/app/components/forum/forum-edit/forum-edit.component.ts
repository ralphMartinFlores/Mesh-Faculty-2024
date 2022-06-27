import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-forum-edit',
  templateUrl: './forum-edit.component.html',
  styleUrls: ['./forum-edit.component.scss']
})
export class ForumEditComponent implements OnInit {
  content: any;

  constructor(public _user:UserService, public _ds:DataService,@Inject(MAT_DIALOG_DATA) public data: any, private dialogReg: MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.content = this.data.content;
    // console.log(this.data.content);
    
  }

  editforum(e){
    e.preventDefault();
    let content = e.target[0].value;
    this.dialogReg.close({
      data : {
        data:{
          content_fld:content
        },
        notif:{
          id:this._user.getUserID(),
          recipient: this._user.getUserID(),
          message: this._user.getFullname()+' edited a comment in a thread.',
          module: 'forums'
        }
      }  
    });
  }
}
