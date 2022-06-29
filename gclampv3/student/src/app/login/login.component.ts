import { Component, OnInit } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router'
import { DeviceDetectorService } from 'ngx-device-detector';
import { DataService } from '../services/data.service';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChangePassModalComponent } from '../components/profile/change-pass-modal/change-pass-modal.component';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { version } from 'package.json';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  version = version
  errMsg: any;
  hide: any;
  isMobile: boolean = false;
  isTablet: boolean = false;
  isDesktopDevice: boolean = false;

  constructor(
    public dialog: MatDialog,
    private router: Router, 
    private _snackbar: MatSnackBar, 
    private deviceService: DeviceDetectorService,
    private ds: DataService, 
    public user: UserService){ }
  showconfirmpassword: boolean = false;
  ngOnInit(): void {
    this.getSettings();
    setTimeout(() => {
      let container:any = document.getElementById('box-container');
      container.classList.toggle('sign-in');
    }, 200)
  }

  getSettings(){
    this.ds._httpRequest('getsettings',null,2).subscribe((data:any)=>{
      data = data;
      console.log(data)     
      this.user.setSettings(data.payload[0]);
    },er=>{
      console.log(er.error.text);
      er = this.user._decrypt(er.error.a);
    })
  }
  detectDevice() {
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktopDevice = this.deviceService.isDesktop();
  }

  toggle(){
    let container:any = document.getElementById('box-container');
    container.classList.toggle('sign-in');
    container.classList.toggle('sign-up');
  }

 
  onSubmit(e){
    e.preventDefault();
    this.user.setLoading(true);
    let f = e.target.elements;
    let param1 = f.param1.value;
    let param2 = f.param2.value;
    let param3: number = 1;
    let param4: string = this.user.isMobile() ? 'Web Access using Mobile phone' : 'Web Access using Desktop/Laptop';
   
    this.ds._httpRequest('studentlogin',{param1,param2,param3,param4},2).subscribe((data:any)=>{
      data = data;
      console.log(data);
      
      if (data.status.remarks === 'success') {
        this.user.setLoading(false);
        this._snackbar.open("Welcome, "+data.payload.fullname +"!", "", {duration:1500});        
        this.user.setUserData(data.payload);    
        this.user.setProfilePicture(data.payload.img);    
        this.user.setLoginState();

        if (data.payload.reset == 0) {
          this.changePassword();
        } else {
          this.router.navigate(['main/classes']);
        }
  
      } else {
        this.errMsg = data.status.message;
      }
    }, (er) => {
      let data = this.user._decrypt(er.error.a);
      this.user.setLoading(false);
      this.errMsg = data.status.message;
    });
  }

  openShowPassword(pw: string) {
    let condel
    const dialogConfig = new MatDialogConfig();
    if (this.user.isMobile()) {
      dialogConfig.maxHeight = '90vh';
      dialogConfig.minHeight = 'auto';
      dialogConfig.minWidth = '70vw';
      dialogConfig.maxWidth = '90vw';
    } else {
      dialogConfig.minHeight = '20vh';
      dialogConfig.minWidth = '15vw';
      dialogConfig.maxHeight = 'auto';
    }
    dialogConfig.data = {
      option: 'forgotpass', 
      newpw: pw
    }
    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.toggle();
    });

  }

  changePassword(){
    const dialogConfig = new MatDialogConfig();
    if (this.user.isMobile()) {
      dialogConfig.maxHeight = '95vh';
      dialogConfig.minHeight = '95vh';
      dialogConfig.minWidth = '95vw';
      dialogConfig.maxWidth = '95vw';
    } else {
      dialogConfig.minHeight = '30vh';
      dialogConfig.minWidth = '60vw';
      dialogConfig.maxWidth = '80vh'; 
      dialogConfig.maxHeight = 'auto';
    }
    const dialogRef = this.dialog.open(ChangePassModalComponent,dialogConfig);
  }

  forgotPassword(e){
    e.preventDefault();
    let param1 = e.target[0].value;
    let param2 = e.target[2].value;
    let param3 = e.target[1].value;
    let param4 = e.target[3].value;

    let load = { param1, param2, param3, param4 }
    // console.log(load);
    
    this.ds._httpRequest('forgotpass',load,2).subscribe((data:any)=>{
      data = this.user._decrypt(data.a);
      // console.log(data);
      this._snackbar.open(data.status.message, null, {duration:1500});
      // this.sendMail(param3,data.payload.pass);
      this.openShowPassword(data.payload.pass);
      e.target[0].value = null;
      e.target[1].value = null;
      e.target[2].value = null;
      e.target[3].value = null;
      
    },er=>{
      er = this.user._decrypt(er.error.a);
      this._snackbar.open(er.status.message, null, {duration:1500});
      // console.log(er);
      
    });
    
  }

  sendMail(email,password){
    let load = {
      emailArray:[email],
      body: "Hello, Your new password is "+password,
      subject:"Reset Password"
    }
    // console.log(load);
    
    this.ds._httpRequest('mailer',load,5).subscribe((data:any)=>{
      data = this.user._decrypt(data.a);
      // console.log("success");
      
    },er =>{
      er = this.user._decrypt(er.error.a);
      // console.log(er);
      
    })
  }

}