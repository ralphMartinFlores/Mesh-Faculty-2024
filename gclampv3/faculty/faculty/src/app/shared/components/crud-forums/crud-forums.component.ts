import { UserService } from './../../../services/user.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-crud-forums',
  templateUrl: './crud-forums.component.html',
  styleUrls: ['./crud-forums.component.scss']
})
export class CRUDForumsComponent implements OnInit {

  Content: any = [];
  ForumsFormGroup: FormGroup;



  constructor(
    private dialogReg: MatDialogRef<CRUDForumsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    public _user: UserService,
    public _ds: DataService) {
  }

  ngOnInit(): void {
    this.ForumsFormGroup = this.fb.group(
      {
        topic_title: ['', Validators.required],
        topic_desc: [''],
      }
    );
    if (this.data.type == 'editmainforum') {
      this.ForumsFormGroup = this.fb.group(
        {
          topic_title: [this.data.data.forumtitle_fld, Validators.required],
          topic_desc: [this.data.data.forumdesc_fld],
        }
      );
    }
  }

  addForumTopic() {
    let load = {
      data: {
        authorid_fld: this._user.getUserID(),
        forumtitle_fld: this.ForumsFormGroup.value.topic_title,
        forumdesc_fld: this.ForumsFormGroup.value.topic_desc,
        isapproved_fld: 1,
      }
    }
    if (this.ForumsFormGroup.valid) {
      this._ds._httpRequest('addforumtopic', load, 1).subscribe((res) => {
        res = this._user._decrypt(res.a);
        this._user.openSnackBar(res.status.message, null, 2000);
        this.closeDialog(res.payload);
      }, err => {
        err = this._user._decrypt(err.a);
      });
    }
  }

  saveForumTopic() {
    let load = {
      data: {
        forumtitle_fld: this.ForumsFormGroup.value.topic_title,
        forumdesc_fld: this.ForumsFormGroup.value.topic_desc,
      }
    }
    if (this.ForumsFormGroup.valid) {
      this._ds._httpRequest('editforum/' + this.data.data.forumcode_fld + '/', load, 1).subscribe((res) => {
        res = this._user._decrypt(res.a);
        this._user.openSnackBar(res.status.message, null, 2000);
        this.closeDialog(res.payload);
      }, err => {
        err = this._user._decrypt(err.a);
      });
    }
  }


  closeDialog(data) {
    this.dialogReg.close(data);
  }

}
