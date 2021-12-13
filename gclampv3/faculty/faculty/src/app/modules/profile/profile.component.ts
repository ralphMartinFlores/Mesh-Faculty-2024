import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChangepasswordComponent } from 'src/app/shared/components/changepassword/changepassword.component';
import { UpdateProfileComponent } from 'src/app/shared/components/update-profile/update-profile.component';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { UpdateProfilePictureComponent } from 'src/app/shared/components/update-profile-picture/update-profile-picture.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {



  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  profiledata: any;
  random: number = Math.random();
  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public _ds: DataService,
    public _user: UserService) { }

  ngOnInit(): void {
    this.getProfile();

  }

  getProfile() {
    this._ds._httpRequest('facultyprofile/' + this._user.getUserID(), null, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.profiledata = dt.payload;
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }


  Changepassword(data) {
    const dialogRef = this.dialog.open(ChangepasswordComponent, {
      panelClass: '',
      data: { data , type: 'changepassword'},
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
    });
  }

  updatePicture() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "40vw";
    dialogConfig.data = {
      load: this.profiledata,
      type: "profile"
    }
    const updatePicture = this.dialog.open(UpdateProfilePictureComponent, dialogConfig);
    updatePicture.afterClosed().subscribe((result: any) => {
      if (result == undefined) return;
      this.profiledata[0].profilepic_fld = result;
    })
  }

  UpdateProfile(data) {
    const dialogRef = this.dialog.open(UpdateProfileComponent, {
      panelClass: '',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: data,
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('100%', 'auto');
      } else {
        dialogRef.updateSize('60%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();

      if (result != undefined) {
        this.profiledata = result;

      }

    });
  }
}
