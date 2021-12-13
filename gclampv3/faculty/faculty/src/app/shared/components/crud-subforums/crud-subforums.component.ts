import { UserService } from './../../../services/user.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-crud-subforums',
  templateUrl: './crud-subforums.component.html',
  styleUrls: ['./crud-subforums.component.scss']
})
export class CrudSubforumsComponent implements OnInit {

  ForumsFormGroup: FormGroup;

  constructor(
    private dialogReg: MatDialogRef<CrudSubforumsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    public _user: UserService,
    public _ds: DataService) {
  }

  ngOnInit(): void {
    this.ForumsFormGroup = this.fb.group({
      topic_title: ['', Validators.required],
      topic_desc: [''],
    });

    if (this.data.type == "editsubtopic") {
      this.ForumsFormGroup = this.fb.group({
        topic_title: [this.data.data.subtitle_fld, Validators.required],
        topic_desc: [this.data.data.subdesc_fld],
      });
    }
  }

  addSubForum() {
    let load = {
      data: {
        forumcode_fld: this.data.data[0].forumcode_fld,
        authorid_fld: this._user.getUserID(),
        subtitle_fld: this.ForumsFormGroup.value.topic_title,
        subdesc_fld: this.ForumsFormGroup.value.topic_desc,
        isapproved_fld: 1,
      }
    }

    if (this.ForumsFormGroup.valid) {
      this._ds._httpRequest('addsubforum', load, 1).subscribe((res) => {
        res = this._user._decrypt(res.a);
        this._user.openSnackBar(res.status.message, null, 2000);
        this.closeDialog(res.payload);
      }, err => {
        err = this._user._decrypt(err.error.a);
      });
    }

  }

  saveSubForum() {
    let load = {
      data: {
        forumcode_fld: this.data.data.forumcode_fld,
        authorid_fld: this._user.getUserID(),
        subtitle_fld: this.ForumsFormGroup.value.topic_title,
        subdesc_fld: this.ForumsFormGroup.value.topic_desc,
        isapproved_fld: 1,
      }
    }
    if (this.ForumsFormGroup.valid) {
      this._ds._httpRequest('editdisc/' + this.data.data.subcode_fld + '/', load, 1).subscribe((res) => {
        res = this._user._decrypt(res.a);
        this.closeDialog(res.payload);
      }, err => {
        err = this._user._decrypt(err.error.a);
      });
    }
  }

  closeDialog(data) {
    this.dialogReg.close(data);
  }
}
