import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-crud-forums-comments',
  templateUrl: './crud-forums-comments.component.html',
  styleUrls: ['./crud-forums-comments.component.scss']
})
export class CrudForumsCommentsComponent implements OnInit {

  constructor(public _user: UserService, public _ds: DataService,
    private dialogReg: MatDialogRef<CrudForumsCommentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialog: MatDialog,) { }


  forumContent = [];

  content: string = '';
  ngOnInit(): void {
    this.initializeComponents();
  }

  initializeComponents() {
    this.getComments();
  }



  getComments() {
    this._ds._httpRequest('getsubcontent', { subcode: this.data.data.subcode_fld }, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.forumContent = dt.payload;
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }

  addReply() {
    let load = {
      subcode_fld: this.data.data[0].subcode_fld,
      authorid_fld: this._user.getUserID(),
      content_fld: this.content,
    }
    this._ds._httpRequest('addreply', load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.forumContent.unshift(dt.payload[0]);
      this.content = '';
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }
}
