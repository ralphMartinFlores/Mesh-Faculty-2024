import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';
import { getRecipients } from 'src/app/services/data.schema';

@Component({
  selector: 'app-delete-record',
  templateUrl: './delete-record.component.html',
  styleUrls: ['./delete-record.component.scss']
})
export class DeleteRecordComponent implements OnInit {
  getRecipients = new getRecipients();
  constructor(public dialogReg: MatDialogRef<DeleteRecordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public _user: UserService,
    public _ds: DataService) { }

  ngOnInit(): void { }

  onNoClick(): void {
    this.dialogReg.close();
  }

  deletePost() {
    let recipients = this.getRecipients.memberMap(this._user.getClassMembers().student);
    let load = {
      data: {
        isdeleted_fld: 1
      }
      , notif: {
        id: this._user.getUserID(),
        recipient: recipients.join(':'),
        message: this._user.getUserFullname() + " Deleted Post in " + this._user.getClassroomInfo().subjdesc_fld,
        module: 'Classroom',
      }
    }
    this._ds._httpRequest('delpost/' + this.data.data.postcode_fld, load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.closeDialog(true);
    }, err => {
      err = this._user._decrypt(err.error.a);
    });
  }


  deleteComments() {
    let load = {
      data: {
        isdeleted_fld: 1
      }, notif: {
        id: this._user.getUserID(),
        recipient: this._user.getUserID(),
        message: this._user.getUserFullname() + " Deleted comments in " + this._user.getClassroomInfo().subjdesc_fld,
        module: 'Classroom',
      }
    }
    this._ds._httpRequest('delcomment/' + this.data.data.commentcode_fld, load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.closeDialog(true);
    }, err => {
      err = this._user._decrypt(err.error.a);
    });
  }

  deleteAct() {
    let recipients = this.getRecipients.memberMap(this._user.getClassMembers().student);
    let load = {
      data: {
        isdeleted_fld: 1
      }, notif: {
        id: this._user.getUserID(),
        recipient: recipients.join(':'),
        message: this._user.getUserFullname() + " Deleted Activity in " + this._user.getClassroomInfo().subjdesc_fld,
        module: 'Classroom',
      }
    }
    this._ds._httpRequest('delact/' + this.data.data.actcode_fld, load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.closeDialog(true);
    }, err => {
      err = this._user._decrypt(err.error.a);
    });
  }

  deleteRes() {
    let recipients = this.getRecipients.memberMap(this._user.getClassMembers().student);
    let load = {
      data: {
        isdeleted_fld: 1
      }
      , notif: {
        id: this._user.getUserID(),
        recipient: recipients.join(':'),
        message: this._user.getUserFullname() + " Deleted Resources in " + this._user.getClassroomInfo().subjdesc_fld,
        module: 'Classroom',
      }
    }
    this._ds._httpRequest('editres/' + this.data.data.rescode_fld, load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.closeDialog(true);
    }, err => {
      err = this._user._decrypt(err.error.a);
      this.closeDialog(true);
    });
  }


  deleteForums() {
    let recipients = this.getRecipients.memberMap(this._user.getClassMembers().student);
    let load = {
      data: {
        isdeleted_fld: 1
      }, notif: {
        id: this._user.getUserID(),
        recipient: recipients.join(':'),
        message: this._user.getUserFullname() + " Deleted Forums in " + this._user.getClassroomInfo().subjdesc_fld,
        module: 'Classroom',
      }
    }
    this._ds._httpRequest('editforum/' + this.data.data.forumcode_fld, load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.closeDialog(true);
    }, err => {
      err = this._user._decrypt(err.error.a);
      this.closeDialog(true);
    });
  }

  deleteSubForums() {
    let recipients = this.getRecipients.memberMap(this._user.getClassMembers().student);
    let load = {
      data: { isdeleted_fld: 1 }, notif: {
        id: this._user.getUserID(),
        recipient: recipients.join(':'),
        message: this._user.getUserFullname() + " Deleted Subforums in " + this._user.getClassroomInfo().subjdesc_fld,
        module: 'Classroom',
      }
    }
    this._ds._httpRequest('delsubforum/' + this.data.data.subcode_fld, load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.closeDialog(true);
    }, err => {
      err = this._user._decrypt(err.error.a);
      this.closeDialog(true);
    });
  }

  deleteReply() {
    let recipients = this.getRecipients.memberMap(this._user.getClassMembers().student);
    let load = {
      data: { isdeleted_fld: 1 }
      , notif: {
        id: this._user.getUserID(),
        recipient: recipients.join(':'),
        message: this._user.getUserFullname() + " Deleted Reply in " + this._user.getClassroomInfo().subjdesc_fld,
        module: 'Classroom',
      }
    }
    this._ds._httpRequest('delforumcont/' + this.data.data.contentcode_fld, load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.closeDialog(true);
    }, err => {
      err = this._user._decrypt(err.error.a);
      this.closeDialog(true);
    });
  }




  closeDialog(data) {
    this.dialogReg.close(data);
  }

}
