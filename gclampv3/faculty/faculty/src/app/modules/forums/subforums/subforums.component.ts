import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { CrudForumsCommentsComponent } from 'src/app/shared/components/crud-forums-comments/crud-forums-comments.component';
import { Overlay } from '@angular/cdk/overlay';
import { CrudSubforumsComponent } from 'src/app/shared/components/crud-subforums/crud-subforums.component';
import { Router } from '@angular/router';
import { DeleteRecordComponent } from 'src/app/shared/components/delete-record/delete-record.component';

@Component({
  selector: 'app-subforums',
  templateUrl: './subforums.component.html',
  styleUrls: ['./subforums.component.scss']
})
export class SubforumsComponent implements OnInit {

  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  SubForumsObject = [];
  selectedForums: any = (this._user.getSelectedForum());

  constructor(private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public _user: UserService,
    public _ds: DataService,
    overlay: Overlay,
    public _router: Router) { }

  ngOnInit(): void {
    this.intializeComponents();
    // this._user._convert(this.selectedForums);
  }

  // ngOnDestroy(): void {
  //   window.sessionStorage.removeItem(btoa('forumtopic'))
  // }

  intializeComponents() {
    this.getSubForumTopic();
  }

  getSubForumTopic() {
    this._ds._httpRequest('getsubforum', { data: { forumcode: this.selectedForums[0].forumcode_fld } }, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.SubForumsObject = dt.payload;
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }

  showforumscomments(item) {
    this._user.setSubSelectedForum([item]);
    // this._router.navigate(['main/forums', item.forumcode_fld, item.subcode_fld]);
    // window.sessionStorage.removeItem(btoa('subforumtopic'));
  }

  editSubforum(d, i) {
    let data = {
      type: 'editsubtopic',
      data: d
    };
    const dialogRef = this.dialog.open(CrudSubforumsComponent, {
      width: '100%',
      height: '100%',
      data: data
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('100%', 'auto');
      } else {
        dialogRef.updateSize('50%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.SubForumsObject[i] = (result[0]);
      }
      responsiveDialogSubscription.unsubscribe();
    });
  }

  AddSubforums() {
    let data = {
      type: 'Subtopic',
      data: this._user.getSelectedForum()
    };
    const dialogRef = this.dialog.open(CrudSubforumsComponent, {
      width: '100%',
      height: '100%',
      data: data
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('100%', 'auto');
      } else {
        dialogRef.updateSize('50%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.SubForumsObject.unshift(result[0]);
      }
      responsiveDialogSubscription.unsubscribe();
    });
  }


  deleteRecords(type, item, i) {
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
        this.SubForumsObject.splice(i, 1);
      }
    });
  }
}
