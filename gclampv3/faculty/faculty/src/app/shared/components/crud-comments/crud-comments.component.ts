import { Component, OnInit, Inject, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatOption } from '@angular/material/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';
import { DeleteRecordComponent } from '../delete-record/delete-record.component';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { getRecipients } from 'src/app/services/data.schema';

@Component({
  selector: 'app-crud-comments',
  templateUrl: './crud-comments.component.html',
  styleUrls: ['./crud-comments.component.scss']
})
export class CrudCommentsComponent implements OnInit, OnDestroy {
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);

  Content: any = [];
  commentObject = [];
  replyObj: any = [];
  getRecipients = new getRecipients();


  constructor(private dialogReg: MatDialogRef<CrudCommentsComponent>, @Inject(MAT_DIALOG_DATA) public data: object,
    private dialog: MatDialog, private fb: FormBuilder,
    public _user: UserService,
    public _ds: DataService, private breakpointObserver: BreakpointObserver,
  ) {
    this.Content = data;
  }

  ngOnInit(): void {
    this.intializeComponents();
  }

  ngOnDestroy(): void {
    // + this.commentObject[0].reply.length
    this.closeDialog(this.commentObject.length);
  }

  intializeComponents() {
    this.getPostComment();
    setTimeout(() => {
      (<HTMLInputElement>document.getElementById('user-input')).focus();
    });

  }

  state(i, item) {
    (<HTMLInputElement>document.getElementById('content_fld' + i)).value = item.content_fld;
    let comments = document.getElementById('comments' + i);
    let img = document.getElementById('img-container' + i);
    let editbox = document.getElementById('edit-box' + i);
    comments.style.display === "none" ? comments.style.display = "block" : comments.style.display = "none";
    img.style.display === "none" ? img.style.display = "block" : img.style.display = "none";
    editbox.style.display === "none" ? editbox.style.display = "flex" : editbox.style.display = "none";
    (<HTMLInputElement>document.getElementById('content_fld' + i)).focus();
  }

  reply_state(i, j, item) {
    (<HTMLInputElement>document.getElementById(i + 'reply_content_fld' + j)).value = item.content_fld;
    let reditbox = document.getElementById(i + 'redit-box' + j);
    // let img = document.getElementById(i + 'img-container' + j);
    let editbox = document.getElementById(i + 'replybox' + j);
    editbox.style.display === "none" ? editbox.style.display = "block" : editbox.style.display = "none";
    // img.style.display === "none" ? img.style.display = "block" : img.style.display = "none";
    reditbox.style.display === "none" ? reditbox.style.display = "flex" : reditbox.style.display = "none";
    (<HTMLInputElement>document.getElementById(i + 'reply_content_fld' + j)).focus();
  }

  closeEdit(i) {
    let editbox = document.getElementById('edit-box' + i);
    let comments = document.getElementById('comments' + i);
    let img = document.getElementById('img-container' + i);
    editbox.style.display === "flex" ? editbox.style.display = "none" : editbox.style.display = "none";
    comments.style.display = 'block';
    img.style.display = 'block';
  }

  closeReplyEdit(i, j) {
    let replybox = document.getElementById(i + 'replybox' + j);
    let redit = document.getElementById(i + 'redit-box' + j);
    redit.style.display === "flex" ? redit.style.display = "none" : redit.style.display = "none";
    replybox.style.display = 'flex';
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
    this._ds._httpRequest('editcomm/' + item.commentcode_fld, { data: { content_fld: f.content_fld.value }, notif: null }, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.commentObject[i].reply[j] = dt.payload[0];
    }, er => {
      er = this._user._decrypt(er.error.a);
    })
  }

  getPostComment() {
    let load = {
      data: { acode: this.Content.postcode, }
    }
    this._ds._httpRequest('getccomment', load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.commentObject = dt.payload;
    }, er => {
      er = this._user._decrypt(er.error.a);
    })
  }

  deleteRecords(type, item, i) {
    let data = {
      type: type,
      data: item,
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
      type: type,
      data: item,
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

  addComments(e) {
    let recipients = this.getRecipients.memberMap(this._user.getClassMembers().student);
    e.preventDefault();
    let f = e.target.elements;
    let load = {
      data: {
        content_fld: f.content_fld.value,
        authorid_fld: this._user.getUserID(),
        classcode_fld: this._user.getClassroomInfo().classcode_fld,
        actioncode_fld: this.Content.postcode,
      }, notif: {
        id: this._user.getUserID(),
        recipient: recipients.join(':'),
        message: this._user.getUserFullname() + " Commented in " + this._user.getClassroomInfo().subjdesc_fld,
        module: 'Classroom',
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
    let x = document.getElementById('replydiv' + i);
    x.style.display === "none" ? x.style.display = "block" : x.style.display = "none";
    let j = document.getElementById('replybtn' + i);
    j.style.display === "none" ? j.style.display = "block" : j.style.display = "none";
    (<HTMLInputElement>document.getElementById("input-content" + i)).focus();
  }

  cancelReply(i) {
    let y = document.getElementById('replydiv' + i);
    let x = document.getElementById('replybtn' + i);
    y.style.display = 'none';
    x.style.display = "flex";
  }

  sendReply(e, item, i) {
    let recipients = this.getRecipients.memberMap(this._user.getClassMembers().student);
    e.preventDefault();
    let f = e.target.elements;
    let load = {
      data: {
        content_fld: f.content_fld.value,
        authorid_fld: this._user.getUserID(),
        classcode_fld: this._user.getClassroomInfo().classcode_fld,
        actioncode_fld: item.commentcode_fld,
      }, notif: {
        id: this._user.getUserID(),
        recipient: recipients.join(':'),
        message: this._user.getUserFullname() + " Added reply in " + this._user.getClassroomInfo().subjdesc_fld,
        module: 'Classroom',
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

  closeDialog(data) {
    this.dialogReg.close(data);
  }


}

