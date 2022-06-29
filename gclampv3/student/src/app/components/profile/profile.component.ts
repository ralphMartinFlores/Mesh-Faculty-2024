import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChangePassModalComponent } from './change-pass-modal/change-pass-modal.component';
import { UpdateProfileModalComponent } from './update-profile-modal/update-profile-modal.component';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeProfilePictureComponent } from './change-profile-picture/change-profile-picture.component';
import { QuestDataItem, ShopItems } from 'src/app/services/data-schema';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  student;
  value = 70;
  showLoader : boolean = true;
  questList = new QuestDataItem();
  shopItems = new ShopItems();
  itemsAcquired = new Array();
  badgesAcquired = new Array();


  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  constructor(public dialog: MatDialog, public _ds: DataService, public _user: UserService, private breakpointObserver: BreakpointObserver, public _snackbar:MatSnackBar) { }

  userQuestData = this._user.getQuestData();
  ngOnInit(): void {
    this.InitializeClaimed()
    this.initializeProfileComponent();
  }

  InitializeClaimed()
  {
    this.getAchievements()
    this.getItems()
  }

  changePassword():void{

    const dialogRef = this.dialog.open(ChangePassModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'changepass',
      disableClose: true
    });

    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('98%', 'auto');
      } else {
        dialogRef.updateSize('50%', 'auto');
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
     
    });



  }

  updateProfilePicture():void{
    const dialogRef = this.dialog.open(ChangeProfilePictureComponent, {
      panelClass: 'dialogpadding',
      maxWidth: '100vw',
      maxHeight: '100vh',
      autoFocus: true,
      disableClose: true,
      data: this.student
    });

    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('98%', 'auto');
      } else {
        dialogRef.updateSize('40%', 'auto');
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();

    });

  }

  updateProfile():void{
    const dialogRef = this.dialog.open(UpdateProfileModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      disableClose: true
    });

    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('98%', 'auto');
      } else {
        dialogRef.updateSize('70%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
      if (result.data) {
        this._ds._httpRequest('updateprofile/'+this._user.getUserID(),result.data,1).subscribe((data:any)=>{
          data = this._user._decrypt(data.a);
          this.student = data.payload;
          this._snackbar.open("Profile updated successfully",null,{duration:1500});

        },er=>{
          er = this._user._decrypt(er.error.a);
        })
      }
    });

  }

  initializeProfileComponent(): void{
    if(btoa('profile') in sessionStorage){
      this.student = this._user.getStudentProfile();
      this.showLoader = false;
    }
    else{
      this.getStudentInfo();
    }

  }


  getStudentInfo():void {
    this._ds._httpRequest('studentprofile', {userid:this._user.getUserID()}, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this._user.setStudentProfile(dt.payload);
      this.student = dt.payload;

      this.showLoader = false;
    },er=>{

    });
  }

  getAchievements () {
    let userDataArrayListCode = this.userQuestData.badges_acquired_fld.split(';')
    this.questList.quest.filter((questData) => {
      userDataArrayListCode.forEach(badgeAcquired => {
        questData.questcode_fld === badgeAcquired ? this.badgesAcquired.push(questData) : null
      });
    })
  }

  getItems() {
    let itemDataArrayListCode = this.userQuestData.items_acquired_fld.split(';')
    this.shopItems.shopItems.filter((shopItems) => {
      itemDataArrayListCode.forEach((itemAcquired) => {
        shopItems.itemcode_fld ===  itemAcquired ? this.itemsAcquired.push(shopItems) : null
      })
    })
  }
}
