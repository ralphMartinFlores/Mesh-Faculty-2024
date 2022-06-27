import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-forum-add',
  templateUrl: './forum-add.component.html',
  styleUrls: ['./forum-add.component.scss']
})
export class ForumAddComponent implements OnInit {

  constructor(public _user:UserService, public _ds:DataService,@Inject(MAT_DIALOG_DATA) public data: any,private dialogReg: MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    // console.log(this.data);
    
  }

  addForum(e){
    e.preventDefault();
    let title = e.target[0].value;
    let details = e.target[1].value;
    this.dialogReg.close({
    data : {
      data:{
        authorid_fld: this._user.getUserID(),
        subtitle_fld: title,
        subdesc_fld: details,
        isapproved_fld: 0,
        forumcode_fld:this.data.code
      },
      notif:{
        id:this._user.getUserID(),
        recipient: this._user.getUserID(),
        message: this._user.getFullname()+' requested to open a subforum.',
        module: 'forums'
      }
    }  
  });  
    
  }

}
