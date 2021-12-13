import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { DataService } from '../services/data.service';
// import { ChatService } from '../services/chat.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteRecordComponent } from '../shared/components/delete-record/delete-record.component';
import { ViewDataOnlyComponent } from '../shared/components/view-data-only/view-data-only.component';
import { SurveyComponent } from '../modules/survey/survey.component';

@Component({
  selector: 'app-mainlayout',
  templateUrl: './mainlayout.component.html',
  styleUrls: ['./mainlayout.component.scss']
})
export class MainlayoutComponent implements OnInit {

  isExtraSmall: Observable<BreakpointState> = this._breakpointObserver.observe(Breakpoints.XSmall);
  random: string = '?' + Math.random();
  notif: any = [];
  @ViewChild('drawer') drawer: any;
  isHandset$: Observable<boolean> = this._breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    // private chat: ChatService,
    private _breakpointObserver: BreakpointObserver,
    private _router: Router,
    public _user: UserService,
    public route: Router,
    public _ds: DataService,
    public dialog: MatDialog,
  ) { }


  ngOnInit(): void {
    if (!(btoa('loginStateFaculty') in sessionStorage && this._user.getLoginState())) {
      this.route.navigate(['login']);
    }
    if(this._user.getIsCovax()!=1 && this._user.getIsCovax()!=2 && this._user.getIsCovax()!=6) {
      this.survey();
    }
    // this.getNotif();
    // this.chat.openWebSocket();
  }

  closeSideNav() {
    if (this.drawer._mode == 'over') {
      this.drawer.close();
    }
  }

  // getNotif() {
  //   this._ds._httpRequest('getnotif', null, 1).subscribe((dt: any) => {
  //     dt = this._user._decrypt(dt.a);
  //     this.notif = dt.payload;
  //   }, er => {
  //     er = this._user._decrypt(er.error.a);
  //   });
  // }

  survey(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    if (this._user.isMobile()) {
      // dialogConfig.minHeight = 'auto';
      dialogConfig.height = "90vh"
      dialogConfig.minWidth = '90vw';
      dialogConfig.width = '90vw';
    } else {
      // dialogConfig.minHeight = '70vh';
      dialogConfig.height = "85vh"
      dialogConfig.minWidth = '60vw';
      dialogConfig.width = '60vw';
    }
    dialogConfig.data = {  }
    const logout = this.dialog.open(SurveyComponent,dialogConfig);
    logout.afterClosed().subscribe((result:any)=>{
      if (result.data) {
        // window.sessionStorage.clear();
        // this._snackbar.open("Successfully logged out", "", {duration:1500});
        // this.router.navigate(['login']);
      }
    })   
  }


  userLogout() {
    let data = {
      "type": 'logout',
    };
    const dialogRef = this.dialog.open(ViewDataOnlyComponent, {
      width: '100%',
      height: '100%',
      disableClose: true,
      data: data,
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('100vw', 'auto');
      } else {
        dialogRef.updateSize('30%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
      if (result = undefined) return
    });

  }



}
