import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { error } from 'protractor';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  errMsg: any;
  hide1: boolean;
  hide2: boolean;
  hide3: boolean;
  npass: any = '';

  passwordStatus: string;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;


  strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

  constructor(
    private dialogReg: MatDialogRef<ChangepasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialog: MatDialog,
    public _user: UserService, private _ds: DataService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.intializeFunctions();
  }

  intializeFunctions() {
    this.firstFormGroup = this.fb.group({
      bdate: ['', Validators.required],
      current: ['', Validators.required],
      newpass: ['', [Validators.required, Validators.minLength(8)]],
      confirmpass: ['', Validators.required],
    });
  }



  focusFunction() {
    this.errMsg = null;
  }

  getErrorMessage() {
    if (this.firstFormGroup.controls.current.hasError('required')) return 'You must enter a value';
    if (this.firstFormGroup.controls.newpass.hasError('required')) return 'You must enter a value';
    if (this.firstFormGroup.controls.confirmpass.hasError('required')) return 'You must enter a value';
  }

  passwordTest(value) {
    let passDisplay = document.getElementById('displaystyle');
    if (passDisplay == null) return;
    if (this.strongRegex.test(value)) {
      this.passwordStatus = 'Strong';
      passDisplay.style.color = 'green';
    } else if (this.mediumRegex.test(value)) {
      this.passwordStatus = 'Average';
      passDisplay.style.color = 'orange';
    } else {
      this.passwordStatus = 'Weak';
      passDisplay.style.color = 'red';
    }
  }

  Changepassword() {
    if (this.firstFormGroup.invalid) return;
    if (this.firstFormGroup.value.newpass != this.firstFormGroup.value.confirmpass) {
      this._user.setLoading(false);
      this.firstFormGroup.controls['confirmpass'].setErrors({ 'incorrect': true });
      this._user.openSnackBar('PASSWORD - Password did not match.', null, 3000);
      return;
    }
    this._user.setLoading(true);
    let load = {
      param1: this.firstFormGroup.value.current,
      param2: this.firstFormGroup.value.newpass,
      param3: this.firstFormGroup.value.confirmpass,
      param4: this.firstFormGroup.value.bdate
    }

    this._ds._httpRequest('changepass/' + this._user.getUserID(), load, 1).subscribe(async (dt: any) => {
      dt = await this._user._decrypt(dt.a);
      this._user.openSnackBar("Password Changed", "Dissmiss", 1000)
      this._ds._httpRequest('updateprofile/' + this._user.getUserID(), { data: { ispwordtochange: 1, bdate_fld: this.firstFormGroup.value.bdate  } }, 1).subscribe((dt: any) => {
        dt = this._user._decrypt(dt.a);
        this._user.updateUserData({ reset: 0 });
        this.closeDialog(true);
        this._user.setLoading(false);
      }, err => {
        err = this._user._decrypt(err.error.a);
        this._user.updateUserData({ reset: 0 });
        this.closeDialog(false);
        this._user.setLoading(false);
      });
    }, (error) => {
      error = this._user._decrypt(error.error.a);
      this.firstFormGroup.controls['current'].setErrors({ 'incorrect': true });
      this._user.openSnackBar('Incorrect password or birthday', null, 3000);
    })
  }

  closeDialog(data) {
    this.dialogReg.close(data);
  }
  
}
