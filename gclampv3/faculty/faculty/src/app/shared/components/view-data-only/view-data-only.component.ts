import { DataService } from 'src/app/services/data.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { UploadingService } from 'src/app/services/uploading.service';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-view-data-only',
  templateUrl: './view-data-only.component.html',
  styleUrls: ['./view-data-only.component.scss']
})
export class ViewDataOnlyComponent implements OnInit {
  Content: any = [];
  date = new Date();
  resourcesfiles = [];
  ScoringForm: FormGroup;
  constructor(private dialogReg: MatDialogRef<ViewDataOnlyComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private dialog: MatDialog, public uploadservice: UploadingService, public _ds: DataService, public _user: UserService, private fb: FormBuilder, private _router: Router) {
    this.Content = data;
  }

  ngOnInit(): void {
    this.initializeComponents();
  }

  ngOnDestroy() {
  }

  getFileExtension(filename) {
    if (filename == 'pdf') {
      return '#EA462E';
    } else if (filename == 'docx') {
      return '#2D5292';
    }
    else if (filename == 'ppt') {
      return '#CA4223';
    }
    else if (filename == 'zip') {
      return '#B23333';
    }
    else if (filename == 'txt') {
      return '#546A7A';
    } else {
      return '#222';
    }
  }

  viewerSelected(data) {
    this.closeDialog(data);
  }

  closeDialog(data) {
    this.dialogReg.close(data);
  }

  getErrorMessage() {
    if (this.ScoringForm.controls.score.hasError('required')) return 'You must enter a value';
  }

  savePoints() {
    if (this.ScoringForm.invalid) return
    this.closeDialog(this.ScoringForm.value.score);
  }


  initializeComponents() {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    days[this.date.getDay()];

    if (this.Content['type'] == 'Resources') this.resourcesfiles = this.uploadservice.splitFilestring(this.Content.data.filedir_fld);

    if (this.Content['type'] == 'score_essay')
      this.ScoringForm = this.fb.group({
        score: [this.data.data.points, Validators.required],
      });
  }


  userLogout() {
    window.sessionStorage.clear();
    this.dialog.closeAll();
    this._router.navigate(['login']);
    this._user.openSnackBar('Logged out successfully', null, 3000);
  }

}
