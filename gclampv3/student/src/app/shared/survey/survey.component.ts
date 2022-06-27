import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { FormControl } from '@material-ui/core';
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
  errorSnackbarConfig: any = {
    duration: 2000,
    verticalPosition: this.verticalPosition,
    horizontalPosition: this.horizontalPosition
  }
  data: any;
  type: string = 'covid'
  isCovax: number = this.user.getIsCovax();
  covaxType: number = this.user.getCovaxType();
  noCovaxReason: string = this.user.getNoCovaxReason();
  frmDisabled: number=0;


  frmResponse: FormGroup = this.formBuilder.group({
    iscovax_fld: [null, Validators.required],
    covaxtype_fld: [null, Validators.required],
    nocovaxreason_fld: [null, Validators.required]
  });


  infoResponse: FormGroup = this.formBuilder.group({
    fname_fld: [null, Validators.required],
    mname_fld: [null, Validators.required],
    lname_fld: [null, Validators.required],
    isip_fld: [null, Validators.required],
    iptype_fld: [null, Validators.required]
  })

  constructor(
    public formBuilder: FormBuilder,
    public user: UserService,
    private ds: DataService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any, 
    private dialogRef: MatDialogRef<SurveyComponent>,
    private snackbar: MatSnackBar
  ) { 
  }

  ngOnInit(): void { 
    this.type = this.dialogData.type
    this.initializeComponent()
  }


  initializeComponent(){
    if(this.type == 'covid'){
      this.frmResponse.controls.covaxtype_fld.disable();
      this.frmResponse.controls.nocovaxreason_fld.disable();
    }
    if(this.type == 'info'){
      console.log('hello')
    }
  }

  dialogClose(): void {
    this.dialogRef.close(true);
  }

  getItemDisabled() {
    console.log(this.frmDisabled);
    if(this.frmDisabled>3) {
      this.frmResponse.controls.covaxtype_fld.disable();
      this.frmResponse.controls.covaxtype_fld.setValue(null);
      this.frmResponse.controls.covaxtype_fld.clearValidators();
    } else {
      this.frmResponse.controls.covaxtype_fld.enable();
      this.frmResponse.controls.covaxtype_fld.setValidators([Validators.required]);
    }

    if(this.frmDisabled>5) {
      this.frmResponse.controls.nocovaxreason_fld.enable();
      this.frmResponse.controls.nocovaxreason_fld.setValidators([Validators.required]);
    } else {
      this.frmResponse.controls.nocovaxreason_fld.disable();
      this.frmResponse.controls.nocovaxreason_fld.setValue(null);
      this.frmResponse.controls.nocovaxreason_fld.clearValidators();
    }
    this.frmResponse.controls.covaxtype_fld.updateValueAndValidity();
    this.frmResponse.controls.nocovaxreason_fld.updateValueAndValidity();
  }

  onSubmit(e: any): void {
    e.preventDefault();
    let response = this.frmResponse.controls;
    if((response.iscovax_fld.value==0)){
      this.snackbar.open("Incomplete Info. All of the enabled items are required", "", this.errorSnackbarConfig);
      return
    }
    if((response.iscovax_fld.value==1 || response.iscovax_fld.value==2) && response.covaxtype_fld.value==0){
      this.snackbar.open("Incomplete Info. All of the enabled items are required", "", this.errorSnackbarConfig);
      return
    }
    if(response.iscovax_fld.value==6 && (response.nocovaxreason_fld.value=='' || response.nocovaxreason_fld.value==null)){
      this.snackbar.open("Incomplete Info. All of the enabled items are required", "", this.errorSnackbarConfig);
      return
    }
    let data: any = {
      iscovax_fld: response.iscovax_fld.value,
      covaxtype_fld: response.covaxtype_fld.value,
      nocovaxreason_fld: response.nocovaxreason_fld.value
    }
    this.ds._httpRequest('updatecovaxinfo', { data, studnum: this.user.getUserID() }, 1).subscribe((res: any)=>{
      this.snackbar.open("Response Submitted!", "", this.snackbarConfig);
      this.dialogClose();
    }, (er: any)=>{
      this.snackbar.open("Unable to submit response! Please try again later.", "", this.snackbarConfig);
    })
  }



  getErrorMessage() {
    if (this.infoResponse.controls.fname_fld.hasError('required')) return 'You must enter a value';
    if (this.infoResponse.controls.mname_fld.hasError('required')) return 'You must enter a value';
    if (this.infoResponse.controls.lname_fld.hasError('required')) return 'You must enter a value';
    if (this.infoResponse.value.isip_fld == 1 && this.infoResponse.controls.iptype_fld.hasError('required')) return 'You must enter a value';
    if (this.infoResponse.controls.isip_fld.hasError('required')) return 'You must enter a value';
    return ''
  }

  onSubmitAdditionalInfo(e: any){
    e.preventDefault()
    if(this.getErrorMessage()!='') return

    let data: any = {
      mother_fld: `${this.infoResponse.value.fname_fld} ${this.infoResponse.value.mname_fld} ${this.infoResponse.value.lname_fld}`,
      iptype_fld: this.infoResponse.value.isip_fld==1?this.infoResponse.value.iptype_fld:''
    }

    // let data = [
    //   dataObj.mother_fld,
    //   dataObj.iptype_fld,
    //   this.user.getUserID()
    // ]
    this.ds._httpRequest('updateinfo', data, 1).subscribe((res: any)=>{
      this.snackbar.open("Response Submitted!", "", this.snackbarConfig);
      this.dialogClose();

    },er=>{
      this.snackbar.open("Unable to submit response! Please try again later.", "", this.snackbarConfig);
    })
  }
}
