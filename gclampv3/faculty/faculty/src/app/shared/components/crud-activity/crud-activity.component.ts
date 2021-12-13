import { UserService } from 'src/app/services/user.service';
import { UploadingService } from './../../../services/uploading.service';
import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DataService } from 'src/app/services/data.service';
import { getRecipients } from 'src/app/services/data.schema';
import { MatOption } from '@angular/material/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-crud-activity',
  templateUrl: './crud-activity.component.html',
  styleUrls: ['./crud-activity.component.scss']
})
export class CrudActivityComponent implements OnInit, OnDestroy {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  getRecipients = new getRecipients();
  filePreviewAndUpload: any = [];
  students: any = [];
  editFiles = [];
  public filepath;
  filesToBeUpdated = [];
  editedFile_dir: any = [];
  @ViewChild('allSelected') private allSelected: MatOption;
  file = '';
  minDate = new Date();
  act_due: any;
  dueDatetime: any;

  constructor(
    private dialogReg: MatDialogRef<CrudActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private datepipe: DatePipe,
    public _user: UserService,
    private _ds: DataService,
    public _uploadservice: UploadingService,
    public _common: CommonService,
  ) { }

  ngOnInit(): void {
    this.intializeFunctions();
    this._uploadservice.files = [];
  }

  ngOnDestroy(): void { }

  intializeFunctions() {
    this.getClassList();
    this.firstFormGroup = this.fb.group({
      act_title: ['', Validators.required],
      act_desc: [''],
      act_pts: ['', Validators.required],
      act_topic: [],
      selected: ['', Validators.required],
    });
    this.secondFormGroup = this.fb.group({});




    if (this.data.type == 'edit_act') {
      this.editActivity();
    } else {
      this.getDate();
    }
  }

  getErrorMessage() {
    if (this.firstFormGroup.controls.act_title.hasError('required')) return 'You must enter a value';
    if (this.firstFormGroup.controls.act_pts.hasError('required')) return 'You must enter a value';
    if (this.firstFormGroup.controls.selected.hasError('required')) return 'You must enter a value';
  }


  getClassList() {
    let load = {
      data: {
        classcode: this._user.getClassroomInfo().classcode_fld,
        acadyear: this._user.getSettings().acadyear_fld,
        semester: this._user.getSettings().sem_fld
      }
    }
    this._ds._httpRequest('getmembers', load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this._user.setClassMembers(dt.payload);
      this.students = dt.payload.student;
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }

  editActivity() {
    this.editedFile_dir = (this.data.data.filedir_fld);
    if (this.editedFile_dir !== '') {
      this.editFiles = this._uploadservice.splitFilestring(this.editedFile_dir);
    }

    try {
      let datetime: any = this.datepipe.transform(new Date(this.data.data.deadline_fld), 'yyyy-MM-dd;HH:mm:ss');
      datetime = datetime.split(';');
      this.act_due = datetime[0];
      this.dueDatetime = datetime[1];
    } catch (error) {
      this.act_due = new Date();
      this.dueDatetime = this.datepipe.transform(new Date(), '23:59:00');
    }
    
    this.firstFormGroup = this.fb.group({
      act_title: [this.data.data.title_fld, Validators.required],
      act_desc: [this.data.data.desc_fld],
      act_pts: [this.data.data.totalscore_fld, Validators.required],
      act_topic: [this.data.data.topiccode_fld, Validators.required],
      selected: ['', Validators.required],
    });
    this.firstFormGroup.controls.selected.patchValue([...this.data.data.recipient_fld.split('.')].map((item: any) => item));
  }


  getDate() {
    this.act_due = new Date();
    this.act_due = this.datepipe.transform(new Date().setDate(new Date().getDate() + 1), 'yyyy-MM-dd');
    this.dueDatetime = new Date();
    this.dueDatetime = this.datepipe.transform(new Date(), '23:59:00');
  }

  tosslePerOne() {

    if (this.allSelected.selected) { this.allSelected.deselect(); return false };

    if (this.firstFormGroup.controls.selected.value.length == this.students.length)
      this.allSelected.select();

  }

  toggleAllSelection() {
    if (this.allSelected.selected)
      this.firstFormGroup.controls.selected.patchValue([...this.students.map((item: any) => item.studnum_fld), '0']);

    if (!this.allSelected.selected)
      this.firstFormGroup.controls.selected.patchValue([]);

  }


  async addActivity() {
    if (this.firstFormGroup.invalid) return;
    this._user.setLoading(true);
    this.act_due = this.datepipe.transform(this.act_due, 'yyyy-MM-dd');
    await this._uploadservice.uploadFiles(this.filePreviewAndUpload).then((files: any) => {
      let recipients = this.getRecipients.memberMap(this._user.getClassMembers().student);
      let load = {
        data: {
          "authorid_fld": this._user.getUserID(),
          "type_fld": 0,
          "recipient_fld": this.firstFormGroup.value.selected.join('.'),
          "topiccode_fld": !this.firstFormGroup.value.act_topic?0:this.firstFormGroup.value.act_topic,
          "title_fld": this.firstFormGroup.value.act_title,
          "desc_fld": this.firstFormGroup.value.act_desc,
          "totalscore_fld": this.firstFormGroup.value.act_pts,
          "classcode_fld": this._user.getClassroomInfo().classcode_fld,
          "withfile_fld": files == null ? 0 : 1,
          "filedir_fld": files == null ? '' : files,
          "deadline_fld": `${this.act_due} ${this.dueDatetime}`,
        }, notif: {
          id: this._user.getUserID(),
          recipient: recipients.join(':'),
          message: this._user.getUserFullname() + " Added Activity in " + this._user.getClassroomInfo().subjdesc_fld,
          module: 'Classroom',
        }
      };
      this._common.commonSubscribe('addactivity', load, 1).then((data: any) => {

        this._user.setLoading(false);
        this.filePreviewAndUpload = [];
        this.closeDialog(data.payload);
        this._user.openSnackBar('The activity has been successfully added. 🤩🐱‍🏍', 'Close', 3000);

      }).catch(() => {
        this._user.setLoading(false);
        this._user.openSnackBar('An error occurred; please try again! 😭💔', 'Close', 3000);
      })
    });

  }

  async saveActivity() {


    if (this.firstFormGroup.invalid) return;
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
          "actcode_fld": this.data.data.actcode_fld,
          "authorid_fld": this._user.getUserID(),
          "type_fld": 0,
          "recipient_fld": this.firstFormGroup.value.selected.join('.'),
          "topiccode_fld": this.firstFormGroup.value.act_topic,
          "title_fld": this.firstFormGroup.value.act_title,
          "desc_fld": this.firstFormGroup.value.act_desc,
          "totalscore_fld": this.firstFormGroup.value.act_pts,
          "classcode_fld": this._user.getClassroomInfo().classcode_fld,
          "withfile_fld": arr == '' ? 0 : 1,
          "filedir_fld": arr,
          "deadline_fld": `${this.datepipe.transform(this.act_due, 'yyyy-MM-dd')} ${this.dueDatetime}`,
          "datetime_fld": this.data.data.datetime_fld,
        }, notif: {
          id: this._user.getUserID(),
          recipient: recipients.join(':'),
          message: this._user.getUserFullname() + " Edited Activity in " + this._user.getClassroomInfo().subjdesc_fld,
          module: 'Classroom',
        }
      };
    
      this._common.commonSubscribe('editpost/' + this.data.data.actcode_fld + '/' + 'act', load, 1)
        .then(() => {
          this.closeDialog(load.data);
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
            "filedir_fld": newFiles
          }, notif: {
            id: this._user.getUserID(),
            recipient: this._user.getUserID(),
            message: this._user.getUserFullname() + " Edited Activity in " + this._user.getClassroomInfo().subjdesc_fld,
            module: 'Classroom',
          }
        }
        this._common.commonSubscribe('editpost/' + this.data.data.actcode_fld + '/' + 'act', load, 1)
          .then((data: any) => {
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
