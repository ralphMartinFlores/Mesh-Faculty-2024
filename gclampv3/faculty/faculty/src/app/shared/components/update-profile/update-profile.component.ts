import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {

  firstFormGroup: FormGroup;
  minDate = new Date();

  userCred: any = this.data.data;
  constructor(private dialogReg: MatDialogRef<UpdateProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialog: MatDialog,
    public _user: UserService, private _ds: DataService,
    private fb: FormBuilder,
    private datepipe: DatePipe,) {
  }

  ngOnInit(): void {
    this.intializeFunctions();
  }


  intializeFunctions() {
    this.firstFormGroup = this.fb.group({
      fname_fld: [''],
      mname_fld: [''],
      lname_fld: [''],
      specialization_fld: [],
      // email_fld: ['', Validators.required],
      extname_fld: [''],
      bdate_fld: ['', Validators.required],
      position_fld: [''],
      educ_fld: [''],
      assignment_fld: ['']
    });

    this.editProfile();
  }

  editProfile() {
    this.firstFormGroup = this.fb.group({
      fname_fld: [this.data.fname_fld, [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
      mname_fld: [this.data.mname_fld, Validators.pattern(/^[A-Za-z]+$/)],
      lname_fld: [this.data.lname_fld, [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
      specialization_fld: [this.data.specialization_fld],
      // email_fld: [this.data.email_fld, Validators.required],
      extname_fld: [this.data.extname_fld],
      bdate_fld: [this.data.bdate_fld, Validators.required],
      position_fld: [this.data.position_fld],
      educ_fld: [this.data.educ_fld],
      assignment_fld: [this.data.assignment_fld],
    });
  }


  getErrorMessage() {
    if (this.firstFormGroup.controls.fname_fld.hasError('pattern')) return 'Invalid Input - Only letters may be alowed.';
    if (this.firstFormGroup.controls.mname_fld.hasError('pattern')) return 'Invalid Input - Only letters may be alowed.';
    if (this.firstFormGroup.controls.lname_fld.hasError('pattern')) return 'Invalid Input - Only letters may be alowed.';

    if (this.firstFormGroup.controls.fname_fld.hasError('required')) return 'You must enter a value';
    // if (this.firstFormGroup.controls.email_fld.hasError('required')) return 'You must enter a value';
    if (this.firstFormGroup.controls.lname_fld.hasError('required')) return 'You must enter a value';
    if (this.firstFormGroup.controls.bdate_fld.hasError('required')) return 'You must enter a value';
  }

  updateProfile() {
    if (this.firstFormGroup.invalid) return;
    this._user.setLoading(true);

    let load = {
      data: {
        fname_fld: this.firstFormGroup.value.fname_fld,
        mname_fld: this.firstFormGroup.value.mname_fld,
        lname_fld: this.firstFormGroup.value.lname_fld,
        specialization_fld: this.firstFormGroup.value.specialization_fld,
        // email_fld: this.firstFormGroup.value.email_fld,
        extname_fld: this.firstFormGroup.value.extname_fld,
        position_fld: this.firstFormGroup.value.position_fld,
        educ_fld: this.firstFormGroup.value.educ_fld,
        assignment_fld: this.firstFormGroup.value.assignment_fld,
        bdate_fld: this.datepipe.transform(this.firstFormGroup.value.bdate_fld, 'yyyy-MM-dd'),
      }, notif: {
        id: this._user.getUserID(),
        recipient: this._user.getUserID(),
        message: this._user.getUserFullname() + "Update Profile",
        module: 'Profile',
      }
    }
    this._ds._httpRequest('updateprofile/' + this._user.getUserID(), load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this._user.openSnackBar('Profile has been successfully updated.', null, 3000);
      this._user.updateUserData({
        fullname: `${dt.payload[0].fname_fld} ${dt.payload[0].mname_fld} ${dt.payload[0].lname_fld} ${dt.payload[0].extname_fld}`
        // emailadd: dt.payload[0].email_fld
      });
      this.closeDialog(dt.payload);
      this._user.setLoading(false);
    }, err => {
      err = this._user._decrypt(err.error.a);
    });
  }

  closeDialog(data) {
    this.dialogReg.close(data);
  }
}
