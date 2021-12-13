import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { getRecipients } from 'src/app/services/data.schema';

@Component({
  selector: 'app-crud-topic',
  templateUrl: './crud-topic.component.html',
  styleUrls: ['./crud-topic.component.scss']
})
export class CrudTopicComponent implements OnInit {
  Topicformgroup: FormGroup;
  getRecipients = new getRecipients();
  constructor(
    private dialogReg: MatDialogRef<CrudTopicComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _user: UserService,
    private _ds: DataService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    if (this.data.type == 'edit_topic') {
      this.Topicformgroup = this.fb.group({
        topicname: [this.data.data.topicname_fld, Validators.required],
      });
    } else {
      this.Topicformgroup = this.fb.group({
        topicname: ['', Validators.required],
      });
    }
  }

  getErrorMessage() {
    if (this.Topicformgroup.controls.topicname.hasError('required')) return 'You must enter a value';
  }

  addTopic() {
    if (this.Topicformgroup.invalid) return;
    this._user.setLoading(true)
    let recipients = this.getRecipients.memberMap(this._user.getClassMembers().student);
    let load = {
      data: {
        topicname_fld: this.Topicformgroup.value.topicname,
        classcode_fld: this._user.getClassroomInfo().classcode_fld,
      }, notif: {
        id: this._user.getUserID(),
        recipient: recipients.join(':'),
        message: this._user.getUserFullname() + " Added Topic in " + this._user.getClassroomInfo().subjdesc_fld,
        module: 'Classroom',
      }
    }
    this._ds._httpRequest('addtopic', load, 1).subscribe((dt: any) => {
      this._user.setLoading(false)
      dt = this._user._decrypt(dt.a);
      this.closeDialog(dt.payload);
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }

  saveTopic() {
    this._user.setLoading(true);
    let recipients = this.getRecipients.memberMap(this._user.getClassMembers().student);
    let load = {
      data: {
        topicname_fld: this.Topicformgroup.value.topicname,
      }, notif: {
        id: this._user.getUserID(),
        recipient: recipients.join(':'),
        message: this._user.getUserFullname() + " Deleted Topic in " + this._user.getClassroomInfo().subjdesc_fld,
        module: 'Classroom',
      }
    }
    this._ds._httpRequest('edittopic/' + this.data.data.topiccode_fld + '/' + 'edit', load, 1).subscribe((res) => {
      res = this._user._decrypt(res.a);
      this._user.setLoading(false);
      this._user.openSnackBar('The topic has been saved successfully.', null, 3000);
      this.closeDialog(load.data);
    }, err => {
      err = this._user._decrypt(err.error.a);
      this._user.openSnackBar('Oh, no! mistake has happened!', null, 3000);
      this._user.setLoading(false);
      this.closeDialog(load.data);
    });
  }

  closeDialog(data) {
    this.dialogReg.close(data);
  }

}
