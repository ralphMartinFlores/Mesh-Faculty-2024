import { CrudActivityComponent } from './../../../shared/components/crud-activity/crud-activity.component';
import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationExtras } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { CrudResourcesComponent } from 'src/app/shared/components/crud-resources/crud-resources.component';
import { CrudTopicComponent } from 'src/app/shared/components/crud-topic/crud-topic.component';
import { ViewDataOnlyComponent } from 'src/app/shared/components/view-data-only/view-data-only.component';
import { DeleteRecordComponent } from 'src/app/shared/components/delete-record/delete-record.component';
import { getRecipients } from 'src/app/services/data.schema';


@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnInit {

  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  activities = [];
  resourcesObj = [];
  topicObj = [];
  getRecipients = new getRecipients();

  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog, private route: Router,
    public _ds: DataService,
    public _user: UserService,
    public _router: Router,
  ) { }

  ngOnInit(): void {
    this.initializeComponents();
  }

  // ##########  DISPLAY activities ################

  initializeComponents() {
    this.getClassActivities();
    this.getClassResources();
    this.getClassTopics();
  }

  ViewResource(item) {
    let data = {
      "type": 'Resources',
      data: item,
    };
    const dialogRef = this.dialog.open(ViewDataOnlyComponent, {
      panelClass: '',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: data
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('98%', 'auto');
      } else {
        dialogRef.updateSize('45%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
    });
  }


  viewActivity(item) {
    window.sessionStorage.removeItem(btoa('activityinfo'));
    this._user.setActivityInfo(item);
  }

  getClassActivities() {
    this._ds._httpRequest('getcpost', { data: { classcode: this._user.getClassroomInfo().classcode_fld, type: null } }, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.activities = dt.payload;
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }

  getClassResources() {
    let load = {
      data: { classcode: this._user.getClassroomInfo().classcode_fld, }
    };
    this._ds._httpRequest('getreslist', load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.resourcesObj = dt.payload;
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }

  editQuiz(item, i) {
    item.istoedit_fld = 1;
    this._user.setQuiz(item);
    this._router.navigate(['/main/quiz']);
  }

  getClassTopics() {
    let load = {
      data: { classcode: this._user.getClassroomInfo().classcode_fld, }
    };
    this._ds._httpRequest('gettopic', load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.topicObj = dt.payload;
      this._user.setTopic(dt.payload);
    }, er => {
      er = this._user._decrypt(er.error.a);
      this.topicObj = [];
    });
  }

  deleteAct(type, item, i) {
    let data = {
      type: type,
      data: item,
    };
    const dialogRef = this.dialog.open(DeleteRecordComponent, {
      panelClass: '',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: data
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('98%', 'auto');
      } else {
        dialogRef.updateSize('20%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
      if (result) {
        this.activities.splice(i, 1);
      }
    });
  }

  deleteRes(type, item, i) {
    let data = {
      type: type,
      data: item,
    };
    const dialogRef = this.dialog.open(DeleteRecordComponent, {
      panelClass: '',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: data
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('98%', 'auto');
      } else {
        dialogRef.updateSize('20%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
      if (result) {
        this.resourcesObj.splice(i, 1);
      }
    });
  }


  // ##########  CREATE activities ################
  createAssignmentDialog() {
    let data = {
      "type": 'assignment',
      "topicdata": this.topicObj,
    };
    const dialogRef = this.dialog.open(CrudActivityComponent, {
      panelClass: 'Assignment-modalbox',
      maxWidth: '100vw',
      maxHeight: '100vh',
      disableClose: true,
      data: data
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
      if (result != undefined) {
        this.activities.unshift(result[0]);
      }
    });
  }


  createResourcesDialog() {
    let data = {
      "type": 'resources',
      "topicdata": this.topicObj,
    };
    const dialogRef = this.dialog.open(CrudResourcesComponent, {
      // panelClass: 'custom-modalbox',
      maxWidth: '100vw',
      maxHeight: '100%',
      disableClose: true,
      data: data
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('90%', 'auto');
      } else {
        dialogRef.updateSize('50%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
      if (result != undefined) {
        this.resourcesObj.unshift(result);
      }
    });
  }


  createTopicDialog() {
    let data = {
      "type": 'topic',
    };
    const dialogRef = this.dialog.open(CrudTopicComponent, {
      width: '100%',
      height: '100%',
      disableClose: true,
      data: data
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
      if (result != undefined) {
        this.topicObj.unshift(result[0]);
      }
    });

  }

  // ##########  EDIT activities ################
  editActivity(item, i) {
    let data = {
      "type": 'edit_act',
      "data": item,
      "topicdata": this.topicObj,

    };
    const dialogRef = this.dialog.open(CrudActivityComponent, {
      panelClass: 'Assignment-modalbox',
      maxWidth: '100vw',
      maxHeight: '100vh',
      disableClose: true,
      data: data
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
      if (result != undefined) {
        this.activities[i] = result;
      }
    });
  }


  editResources(item, i: number) {
    let data = {
      "type": 'edit_resources',
      "data": item,
      "topicdata": this.topicObj,
    };
    const dialogRef = this.dialog.open(CrudResourcesComponent, {
      // panelClass: 'custom-modalbox',
      maxWidth: '100vw',
      maxHeight: '100%',
      disableClose: true,
      data: data
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('90%', 'auto');
      } else {
        dialogRef.updateSize('50%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
      if (result != undefined) {
        this.resourcesObj[i] = result;
      }
    });
  }

  editTopic(item, i) {
    let data = {
      "type": 'edit_topic',
      "data": item,
    };
    const dialogRef = this.dialog.open(CrudTopicComponent, {
      width: '100%',
      height: '100%',
      disableClose: true,
      data: data
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
      if (result != undefined) {
        this.getObjects();
      }
    });
  }



  deleteTopic(data, i) {
    let load = {
      data: {
        isdeleted_fld: 1
      }, notif: {
        id: this._user.getUserID(),
        recipient: "",
        message: this._user.getUserFullname() + " Deleted Topic in " + this._user.getClassroomInfo().subjdesc_fld,
        module: 'Activities',
      }
    };
    this._ds._httpRequest('edittopic/' + data.topiccode_fld + '/' + 'del', load, 1).subscribe((res) => {
      res = this._user._decrypt(res.a);
      this.getObjects();
    }, (err) => {
      err = this._user._decrypt(err.error.a);
      this.getObjects();
    });
  }

  getObjects() {
    this.getClassActivities();
    this.getClassResources();
    this.getClassTopics();
  }
  // ##########  OTHER  STUFF IN UI ################
  panelOpenState = false;


  moveToTopic(topic, type, item) {
    let recipients = this.getRecipients.memberMap(this._user.getClassMembers().student);
    let load: any;
    switch (type) {
      case 'act':

        load = {
          data: {
            "topiccode_fld": topic == 0 ? 0 : topic.topiccode_fld,
          }, notif: {
            id: this._user.getUserID(),
            recipient: recipients.join(':'),
            message: this._user.getUserFullname() + " Activity moved in Label" + this._user.getClassroomInfo().subjdesc_fld,
            module: 'Classroom',
          }
        };
        this._ds._httpRequest('editpost/' + item + '/' + 'act', load, 1).subscribe((res: any) => {
          res = this._user._decrypt(res.a);
          this.getObjects();
          this._user.openSnackBar('The activities were successfully saved.', null, 3000);
        }, er => {
          er = this._user._decrypt(er.error.a);
        });
        break;
      case 'res':
        load = {
          data: {
            "topiccode_fld": topic == 0 ? 0 : topic.topiccode_fld,
          }, notif: {
            id: this._user.getUserID(),
            recipient: recipients.join(':'),
            message: this._user.getUserFullname() + " Resources moved in Label" + this._user.getClassroomInfo().subjdesc_fld,
            module: 'Classroom',
          }
        };

        this._ds._httpRequest('editres/' + item, load, 1).subscribe((res: any) => {
          res = this._user._decrypt(res.a);
          this.getObjects();
          this._user.openSnackBar('The activities were successfully saved.', null, 3000);
        }, er => {
          er = this._user._decrypt(er.error.a);
        });
        break;

      default:
        break;
    }
  }


}



