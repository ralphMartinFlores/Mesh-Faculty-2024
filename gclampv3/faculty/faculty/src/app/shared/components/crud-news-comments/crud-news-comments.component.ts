import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatOption } from '@angular/material/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { DeleteRecordComponent } from '../delete-record/delete-record.component';
import { BreakpointState, Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-crud-news-comments',
  templateUrl: './crud-news-comments.component.html',
  styleUrls: ['./crud-news-comments.component.scss']
})
export class CrudNewsCommentsComponent implements OnInit, OnDestroy {
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  commentObject: any = [];

  constructor(
    private dialogReg: MatDialogRef<CrudNewsCommentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public _ds: DataService,
    public _user: UserService,
    private breakpointObserver: BreakpointObserver,
  ) {
  }

  ngOnInit(): void {
    this.getAnnComment();
  }

  ngOnDestroy(): void {
    this.closeDialog(this.commentObject.length);
  }

  getAnnComment() {
    let load = {
      data: { acode: this.data.data.announcecode_fld, }
    }
    this._ds._httpRequest('getccomment', load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.commentObject = dt.payload;
    }, er => {
      er = this._user._decrypt(er.error.a);
    })
  }

  addComments(e) {
    e.preventDefault();
    let f = e.target.elements;
    let load = {
      data: {
        content_fld: f.content_fld.value,
        authorid_fld: this._user.getUserID(),
        actioncode_fld: this.data.data.announcecode_fld,
      }
    }
    this._ds._httpRequest('addcomment', load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      f.content_fld.value = null;
      this.commentObject.unshift(dt.payload[0]);
    }, er => {
      er = this._user._decrypt(er.error.a);
    })
  }

  addReply(item, i) {
    var x = document.getElementById('replydiv' + i);
    x.style.display === "none" ? x.style.display = "block" : x.style.display = "none";
    var j = document.getElementById('replybtn' + i);
    j.style.display === "none" ? j.style.display = "block" : j.style.display = "none";
  }

  cancelReply(i) {
    var y = document.getElementById('replydiv' + i);
    var x = document.getElementById('replybtn' + i);
    y.style.display = 'none';
    x.style.display = "flex";
  }

  sendReply(e, item, i) {
    e.preventDefault();
    let f = e.target.elements;
    let load = {
      data: {
        content_fld: f.content_fld.value,
        authorid_fld: this._user.getUserID(),
        classcode_fld: this._user.getClassroomInfo().classcode_fld,
        actioncode_fld: item.commentcode_fld,
      }
    }
    this._ds._httpRequest('addcomment', load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      if (this.commentObject[i].reply == null) {
        this.commentObject[i].reply = [];
        this.commentObject[i].reply.push(dt.payload[0]);
      } else {
        this.commentObject[i].reply.push(dt.payload[0]);
      }
      f.content_fld.value = null;
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }

  state(i, item) {
    (<HTMLInputElement>document.getElementById('content_fld' + i)).value = item.content_fld;
    var comments = document.getElementById('comments' + i);
    var img = document.getElementById('img-container' + i);
    var editbox = document.getElementById('edit-box' + i);
    comments.style.display === "none" ? comments.style.display = "block" : comments.style.display = "none";
    img.style.display === "none" ? img.style.display = "block" : img.style.display = "none";
    editbox.style.display === "none" ? editbox.style.display = "flex" : editbox.style.display = "none";
  }
  reply_state(i, j, item) {
    (<HTMLInputElement>document.getElementById(i + 'reply_content_fld' + j)).value = item.content_fld;
    var reditbox = document.getElementById(i + 'redit-box' + j);
    var editbox = document.getElementById(i + 'replybox' + j);
    editbox.style.display === "none" ? editbox.style.display = "block" : editbox.style.display = "none";
    reditbox.style.display === "none" ? reditbox.style.display = "flex" : reditbox.style.display = "none";
  }

  saveComment(e, i, item) {
    e.preventDefault();
    let f = e.target.elements;
    this._ds._httpRequest('editcomm/' + item.commentcode_fld, { data: { content_fld: f.content_fld.value } }, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.commentObject[i].content_fld = dt.payload[0].content_fld;
      this.state(i, dt.payload[0].content_fld);
    }, er => {
      er = this._user._decrypt(er.error.a);
    })

  }

  saveReply(e, i, j, item) {
    e.preventDefault();
    let f = e.target.elements;
    this._ds._httpRequest('editcomm/' + item.commentcode_fld, { data: { content_fld: f.content_fld.value } }, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.commentObject[i].reply[j] = dt.payload[0];
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }

  closeEdit(i) {
    var editbox = document.getElementById('edit-box' + i);
    var comments = document.getElementById('comments' + i);
    var img = document.getElementById('img-container' + i);
    editbox.style.display === "flex" ? editbox.style.display = "none" : editbox.style.display = "none";
    comments.style.display = 'block';
    img.style.display = 'block';
  }
  closeReplyEdit(i, j) {
    var replybox = document.getElementById(i + 'replybox' + j);
    var redit = document.getElementById(i + 'redit-box' + j);
    redit.style.display === "flex" ? redit.style.display = "none" : redit.style.display = "none";
    replybox.style.display = 'flex';
  }


  deleteRecords(type, item, i) {
    let data = {
      data: {
        type: type,
        data: item,
      }
    };
    const dialogRef = this.dialog.open(DeleteRecordComponent, {
      panelClass: '',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: data
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('98%', 'auto');
      } else {
        dialogRef.updateSize('20%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
      if (result) {
        this.commentObject.splice(i, 1);
      }
    });
  }


  deleteReply(type, item, i, j) {
    let data = {
      data: {
        type: type,
        data: item,
      }
    };
    const dialogRef = this.dialog.open(DeleteRecordComponent, {
      panelClass: '',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: data
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('98%', 'auto');
      } else {
        dialogRef.updateSize('20%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
      if (result) {
        this.commentObject[i].reply.splice(j, 1);
      }
    });
  }


  closeDialog(data) {
    this.dialogReg.close(data);
  }
}
