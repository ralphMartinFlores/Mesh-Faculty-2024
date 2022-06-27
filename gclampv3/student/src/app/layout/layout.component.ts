import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { ChatService } from '../services/chat.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { SurveyComponent } from '../shared/survey/survey.component';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  @ViewChild('drawer') drawer: any;
  date = new Date();
  value = 70;
  isHandset$: Observable<boolean> = this._breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
    notifications = [];
    notifObject: any = [];
    count=0;

  constructor(
    public dialog:MatDialog, private _breakpointObserver: BreakpointObserver, private router: Router, public ds: DataService, public user: UserService, private _snackbar: MatSnackBar) { }


  showNotification: boolean = false;


  ngOnInit(): void {
    // this.getnotification()
    this.getQuestData()
    if(this.user.getIsSurvey()!=1) { this.survey('info') }
    if(this.user.getIsCovax()!=1 && this.user.getIsCovax()!=2 && this.user.getIsCovax()!=6) {
      this.survey('covid');
    }
    // this.chat.openWebSocket();
    setInterval(() => {
      this.date = new Date();
    }, 1000);
  }


  closeSideNav() {
    if (this.drawer._mode == 'over') {
      this.drawer.close();
    }
  }

  logout(option) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    if (this.user.isMobile()) {
      dialogConfig.width = '100%';
    } else {
      dialogConfig.width = '18%';
    }
    dialogConfig.data = {
      option:option
    }
    const logout = this.dialog.open(DialogComponent,dialogConfig);
    logout.afterClosed().subscribe((result:any)=>{
      if (result.data) {
        window.sessionStorage.clear();
        this._snackbar.open("Successfully logged out", "", {duration:1500});
        this.router.navigate(['login']);
      }
    })   
  }

  openNotification() {
    this.showNotification = !this.showNotification;
  }

  closeNotification(state:boolean) {
    this.showNotification = state;
  }

  getnotification() {
    this.ds._httpRequest('getnotif',null,1).subscribe((data:any)=>{
      data = this.user._decrypt(data.a);
      this.notifObject = data.payload;
      this.count = data.payload.length;
      
    },er=>{
      er = this.user._decrypt(er.error.a);
      this.count = 0;
    })
  }

  getQuestData() {
    this.ds._httpRequest('gameprogress',null,1).subscribe((data:any)=>{
      data = this.user._decrypt(data.a);
      
      this.user.setQuestData(data.payload[0]);
    },error => {
      error = this.user._decrypt(error.error.a)
      
    })
  }

  survey(surveyType = ''): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    if (this.user.isMobile()) {
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
    dialogConfig.data = { 
      type: surveyType
     }
    const logout = this.dialog.open(SurveyComponent,dialogConfig);
    logout.afterClosed().subscribe((result:any)=>{
      if (result.data) {
        // window.sessionStorage.clear();
        // this._snackbar.open("Successfully logged out", "", {duration:1500});
        // this.router.navigate(['login']);
      }
    })   
  }
    
  }


  



