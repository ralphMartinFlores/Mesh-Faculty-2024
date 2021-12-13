import { DataService } from './../services/data.service';
import { Component, OnInit } from '@angular/core';
import { version } from 'package.json';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CommonService } from '../services/common.service';
import { ChangepasswordComponent } from '../shared/components/changepassword/changepassword.component';
import { BreakpointState, Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  version = version
  hide: boolean = true;
  errMsg: any;
  showpassword: number = 0;
  LoginFormGroup: FormGroup;

  constructor(
    public route: Router,
    public _user: UserService,
    public _ds: DataService,
    private fb: FormBuilder,
    private _commonsub: CommonService,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initializeComponents();
  }

  initializeComponents() {
    if (btoa('loginStateFaculty') in sessionStorage && this._user.getLoginState()) {
      this.route.navigate(['main']);
    }
    this.getSettings();


    this.LoginFormGroup = this.fb.group({
      user_email: ['', [Validators.required, Validators.email]],
      user_pass: ['', Validators.required],
    });
  }

  getSettings() {
    this._user.setLoading(true)
    this._commonsub.commonSubscribe('getacadyear', null, 2).then((data: any) => {
      this._user.setSettings(data.payload[0]);
      this._user.setLoading(false);
    }).catch((error) => {
      this._user.setLoading(false)
    })
  }

  getErrorMessage() {
    if (this.LoginFormGroup.controls.user_email.hasError('required')) return 'You must enter a value';
    if (this.LoginFormGroup.controls.user_email.hasError('email')) return 'Not a valid email';
    if (this.LoginFormGroup.controls.user_email.hasError('incorrect')) return 'EMAIL OR USERNAME - Login or password is invalid.';
  }

  getPassErrorMessage() {
    if (this.LoginFormGroup.controls.user_pass.hasError('required')) return 'You must enter a value';
    if (this.LoginFormGroup.controls.user_pass.hasError('incorrect')) return 'Invalid username or password.';
  }

  onSubmit() {
    let load = {
      param1: this.LoginFormGroup.value.user_email,
      param2: this.LoginFormGroup.value.user_pass,
      param3: 5,
      param4: this._user.isMobile() ? 'Web Access using Mobile phone' : 'Web Access using Desktop/Laptop',
    }

    this._user.setLoading(true);
    this._commonsub.commonSubscribe('facultylogin', load, 2).then(async ( data: any) => {
      this._user.setData('user', data.payload);
      await data.payload.reset == 0 ? this.Changepassword() : this.isAuthorized();
      // this._user.setLoading(false);
    }).catch((error: any) => {
      // this.LoginFormGroup.controls['user_email'].setErrors({ 'incorrect': true });
      this.LoginFormGroup.controls['user_pass'].setErrors({ 'incorrect': true });
      this._user.setLoading(false);
    });
  }

  Changepassword() {
    const dialogRef = this.dialog.open(ChangepasswordComponent, {
      panelClass: '',
      data: { type: 'changepassinfirstlogin' },
      disableClose: true,
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('98%', 'auto');
      } else {
        dialogRef.updateSize('60%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
      if (result) this.isAuthorized();
    });
  }


  forgotPassword(e) {
    e.preventDefault();
    let f = e.target.elements;
    let param1 = f.param1.value;
    let param2 = f.param2.value;
    let param3 = f.param3.value;
    this._ds._httpRequest('forgotpass', { param1, param2, param3 }, 2).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      console.log(dt);

    });
  }


  isAuthorized() {
    this._user.setLoginState(true);
    this.route.navigate(['main']);
    this._user.setLoading(false);
  }

}
