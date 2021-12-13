import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { getRecipients } from 'src/app/services/data.schema';
import { DataService } from 'src/app/services/data.service';
import { UploadingService } from 'src/app/services/uploading.service';
import { UserService } from 'src/app/services/user.service';
import { CRUDForumsComponent } from '../crud-forums/crud-forums.component';

@Component({
  selector: 'app-crud-post',
  templateUrl: './crud-post.component.html',
  styleUrls: ['./crud-post.component.scss']
})
export class CrudPostComponent implements OnInit {
  postForms: FormGroup;
  editFiles = [];
  editedFile_dir: any = [];
  filesToBeUpdated = [];
  filePreviewAndUpload: any = [];
  getRecipients = new getRecipients();


  constructor(
    private dialogReg: MatDialogRef<CRUDForumsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    public _user: UserService,
    public _ds: DataService,
    public _uploadservice: UploadingService,
    private _common: CommonService,
  ) {
  }

  ngOnInit(): void {
    this._uploadservice.files = [];
    if (this.data.type == 'edit_post') {
      this.editPost();
    }
  }

  editPost() {
    this.postForms = this.fb.group({
      content_fld: [this.data.data.content_fld, Validators.required],
    });
    this.editedFile_dir = this.data.data.dir_fld;
    if (this.editedFile_dir !== '') {
      this.editFiles = this._uploadservice.splitFilestring(this.editedFile_dir);
    }
  }

  async savePost() {
    if ((this.filePreviewAndUpload.length == 0 && this.postForms.value.content_fld == '')) return;
    this._user.setLoading(true);
    await this._uploadservice.uploadFiles(this.filePreviewAndUpload).then((files: any) => {
      let arr: any;
      let recipients = this.getRecipients.memberMap(this._user.getClassMembers().student);
      if (files != null) {
        arr = [...this.editedFile_dir.split(':'), ...files.split(':')];
        arr = arr.filter((f) => {
          return f != "";
        });
        arr = arr.join(':');
      } else if (files == null) {
        arr = this.editedFile_dir;
      }

      let load = {
        data: {
          "content_fld": this.postForms.value.content_fld,
          "withfile_fld": arr == '' ? 0 : 1,
          "dir_fld": arr,
          "datetime_fld": this.data.data.datetime_fld,
        }, notif: {
          id: this._user.getUserID(),
          recipient: recipients.join(':'),
          message: this._user.getUserFullname() + " Edited Post in " + this._user.getClassroomInfo().subjdesc_fld,
          module: 'Classroom',
        }
      };

      this._common.commonSubscribe('editpost/' + this.data.data.postcode_fld + '/' + 'post', load, 1)
        .then((data: any) => {
          this._user.setLoading(false);
          this.closeDialog(data.payload);
          this._user.setLoading(false);
        });
    });

  }


  async deleteFiles(i, path) {
    let newFiles: any = [];
    this._common.commonSubscribe('deletefile', { dir_fld: path }, 1)
      .then(() => {
        this.editFiles.splice(i, 1);
        this.editFiles.map((f) => {
          newFiles.push(f.name + '?' + f.path);
        })
      })
      .then(() => {
        newFiles = newFiles.join(':');
        let load = {
          data: {
            "withfile_fld": newFiles == '' ? 0 : 1,
            "dir_fld": newFiles
          }, notif: {
            id: this._user.getUserID(),
            recipient: this._user.getUserID(),
            message: this._user.getUserFullname() + " Edited Post in " + this._user.getClassroomInfo().subjdesc_fld,
            module: 'Classroom',
          }
        }
        this._common.commonSubscribe('editpost/' + this.data.data.postcode_fld + '/' + 'post', load, 1)
          .then((data: any) => {
            this.editedFile_dir = data.payload[0].dir_fld;
          });
      }).catch((error) => {
        error
      });
  }




  getFile(event: any) {
    this.filePreviewAndUpload = this._uploadservice.getFilePreview(event);
  }

  removeFilePreviews(i) { this.filePreviewAndUpload.splice(i, 1); }

  closeDialog(data) {
    this.dialogReg.close(data);
  }
}

