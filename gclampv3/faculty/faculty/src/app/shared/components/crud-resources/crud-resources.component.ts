import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { UploadingService } from 'src/app/services/uploading.service';
import { UserService } from 'src/app/services/user.service';
import { getRecipients } from 'src/app/services/data.schema';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-crud-resources',
  templateUrl: './crud-resources.component.html',
  styleUrls: ['./crud-resources.component.scss']
})
export class CrudResourcesComponent implements OnInit {
  ResourceFormGroup!: FormGroup;
  filePreviewAndUpload: any = [];
  editedFile_dir: any = [];
  editFiles: any = [];
  filesToBeUpdated = [];
  getRecipients = new getRecipients();
  file = '';

  constructor(
    private dialogReg: MatDialogRef<CrudResourcesComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialog: MatDialog, private fb: FormBuilder,
    public _user: UserService,
    private _ds: DataService,
    private _uploadservice: UploadingService,
    public uploadservice: UploadingService,
    private _common: CommonService,
  ) { }

  ngOnInit(): void {
    this.intializeFunctions();
  }

  intializeFunctions() {
    this.uploadservice.files = [];
    this.ResourceFormGroup = this.fb.group({
      res_title: ['', Validators.required],
      res_desc: [''],
      res_topic: ['']
    });
    if (this.data.type == 'edit_resources') {
      this.editResources();
    }
  }

  getErrorMessage() {
    if (this.ResourceFormGroup.controls.res_title.hasError('required')) return 'You must enter a value';
  }

  editResources() {
    this.ResourceFormGroup = this.fb.group({
      res_title: [this.data.data.title_fld, Validators.required],
      res_desc: [this.data.data.desc_fld],
      res_topic: [this.data.data.topiccode_fld]
    });

    this.editedFile_dir = (this.data.data.filedir_fld);
    if (this.editedFile_dir !== '') {
      this.editFiles = this.uploadservice.splitFilestring(this.data.data.filedir_fld);
    }
  }

  async addResources() {
    if (this.filePreviewAndUpload.length == 0 || this.ResourceFormGroup.invalid) return;
    this._user.setLoading(true);
    await this._uploadservice.uploadFiles(this.filePreviewAndUpload).then((files: any) => {
      let recipients = this.getRecipients.memberMap(this._user.getClassMembers().student);
      let load = {
        data: {
          "authorid_fld": this._user.getUserID(),
          "topiccode_fld": !this.ResourceFormGroup.value.res_topic?0:this.ResourceFormGroup.value.res_topic,
          "title_fld": this.ResourceFormGroup.value.res_title,
          "desc_fld": this.ResourceFormGroup.value.res_desc,
          "classcode_fld": this._user.getClassroomInfo().classcode_fld,
          "withfile_fld": files == null ? 0 : 1,
          "filedir_fld": files == null ? '' : files,
        }, notif: {
          id: this._user.getUserID(),
          recipient: recipients.join(':'),
          message: this._user.getUserFullname() + " Added Resources in " + this._user.getClassroomInfo().subjdesc_fld,
          module: 'Classroom',
        }
      };
      this._common.commonSubscribe('addresource', load, 1).then((data: any) => {
        console.log(data)
        this._user.setLoading(false);
        this.filePreviewAndUpload = [];
        this.closeDialog(data.payload[0]);
        this._user.openSnackBar('The resources has been successfully added. 🐱‍🏍 ', 'Close', 3000);
      }).catch((error) => {
        this._user.setLoading(false);
        this._user.openSnackBar('An error occurred; please try again!', 'Close', 3000);
      })
    });
  }

  async saveResources() {
    if ((this.filePreviewAndUpload.length == 0 && this.editedFile_dir == '') || this.ResourceFormGroup.invalid) return;
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
          "rescode_fld": this.data.data.rescode_fld,
          "authorid_fld": this._user.getUserID(),
          "topiccode_fld": this.ResourceFormGroup.value.res_topic,
          "title_fld": this.ResourceFormGroup.value.res_title,
          "desc_fld": this.ResourceFormGroup.value.res_desc,
          "classcode_fld": this._user.getClassroomInfo().classcode_fld,
          "withfile_fld": arr == '' || arr == null ? 0 : 1,
          "filedir_fld": arr == null ? this.editedFile_dir : arr,
          "datetime_fld": this.data.data.datetime_fld,
        }, notif: {
          id: this._user.getUserID(),
          recipient: recipients.join(':'),
          message: this._user.getUserFullname() + " Edited Resources in " + this._user.getClassroomInfo().subjdesc_fld,
          module: 'Classroom',
        }
      };
      this._common.commonSubscribe('editres/' + this.data.data.rescode_fld, load, 1)
        .then(() => {
          this.closeDialog(load.data);
          this._user.setLoading(false);
        });
    });

  }

  async deleteFiles(i, path) {
    this._user.setLoading(true);
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
            "filedir_fld": newFiles
          }, notif: {
            id: this._user.getUserID(),
            recipient: this._user.getUserID(),
            message: this._user.getUserFullname() + " Edited Rescources in " + this._user.getClassroomInfo().subjdesc_fld,
            module: 'Classroom',
          }
        }
        this._common.commonSubscribe('editres/' + this.data.data.rescode_fld, load, 1)
          .then((data: any) => {
            this._user.setLoading(false);
            this.editedFile_dir = data.payload[0].filedir_fld;     
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

  getFileExtension(filename) {
    if (filename.split('.').pop() == 'txt') {
      return this.file = 'assets/file/txt.png';
    } else if (filename.split('.').pop() == 'pdf') {
      return this.file = 'assets/file/pdf.png';
    } else if (filename.split('.').pop() == 'docx' || filename.split('.').pop() == 'doc') {
      return this.file = 'assets/file/docx.png';
    } else if (filename.split('.').pop() == 'ppt' || filename.split('.').pop() == 'pptx') {
      return this.file = 'assets/file/ppt.png';
    } else if (filename.split('.').pop() == 'zip') {
      return this.file = 'assets/file/zip.png';
    } else if (filename.split('.').pop() == 'sql') {
      return this.file = 'assets/file/mp4.png';
    }
    else if (filename.split('.').pop() == 'png') {
      return this.file = 'assets/file/mp4.png';
    }
    else {
      return this.file = 'assets/file/nofile.png';
    }
  }


}
