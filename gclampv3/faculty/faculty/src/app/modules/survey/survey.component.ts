import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = "center";
  verticalPosition: MatSnackBarVerticalPosition = "bottom";
  snackbarConfig: any = {
    duration: 1000,
    verticalPosition: this.verticalPosition,
    horizontalPosition: this.horizontalPosition
  }
  data: any;
  isCovax: number = this.user.getIsCovax();
  covaxType: number = this.user.getCovaxType();
  noCovaxReason: string = this.user.getNoCovaxReason();
  frmDisabled: number=0;

  frmResponse: FormGroup = this.formBuilder.group({
    iscovax_fld: [null, Validators.required],
    covaxtype_fld: [null],
    nocovaxreason_fld: [null]
  })

  constructor(
    public formBuilder: FormBuilder,
    public user: UserService,
    private ds: DataService,
    @Inject(MAT_DIALOG_DATA) data: any, 
    private dialogRef: MatDialogRef<SurveyComponent>,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void { 
    this.frmResponse.controls.covaxtype_fld.disable();
    this.frmResponse.controls.nocovaxreason_fld.disable();
  }

  dialogClose(): void {
    this.dialogRef.close(true);
  }

  getItemDisabled() {
    if(this.frmDisabled>3) {
      this.frmResponse.controls.covaxtype_fld.disable();
      this.frmResponse.controls.covaxtype_fld.setValue(0);
    } else {
      this.frmResponse.controls.covaxtype_fld.enable()
    }

    if(this.frmDisabled>5) {
      this.frmResponse.controls.nocovaxreason_fld.enable();
    } else {
      this.frmResponse.controls.nocovaxreason_fld.disable();
      this.frmResponse.controls.nocovaxreason_fld.setValue(null)
    }
  }

  onSubmit(e: any): void {
    e.preventDefault();
    let response = this.frmResponse.controls;
    let data: any = {
      iscovax_fld: response.iscovax_fld.value,
      covaxtype_fld: response.covaxtype_fld.value,
      nocovaxreason_fld: response.nocovaxreason_fld.value
    }
    console.log(data);
    this.ds._httpRequest('updatecovaxinfo', { data, empcode: this.user.getUserID() }, 1).subscribe((res: any)=>{
      this.snackbar.open("Response Submitted!", "", this.snackbarConfig);
      this.dialogClose();
    }, (er: any)=>{
      this.snackbar.open("Unable to submit response! Please try again later.", "", this.snackbarConfig);
    })
  }
}
