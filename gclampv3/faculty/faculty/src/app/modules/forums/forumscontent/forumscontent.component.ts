import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import { DeleteRecordComponent } from 'src/app/shared/components/delete-record/delete-record.component';
import { BreakpointState, Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Overlay } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-forumscontent',
  templateUrl: './forumscontent.component.html',
  styleUrls: ['./forumscontent.component.scss']
})
export class ForumscontentComponent implements OnInit {
  subforumContent = this._user.getSubSelectedForum();
  content: string = '';
  forumContent = [];

  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  SubForumsObject = [];
  selectedForums: any = (this._user.getSelectedForum());

  constructor(private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public _user: UserService,
    public _ds: DataService,
    overlay: Overlay,
    public _router: Router,
    private ar: ActivatedRoute, private _location: Location,) {
    // this._user._convert(this.subforumContent);
  }

  ngOnInit(): void {
    this.getComments();
  }

  getComments() {
    this._ds._httpRequest('getsubcontent', { data: { subcode: this.subforumContent[0].subcode_fld } }, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.forumContent = dt.payload;
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }


  addReply() {
    let subcode;
    this.ar.paramMap.subscribe((p) => {
      subcode = p.get('sid');
    });


    let load = {
      data: {
        subcode_fld: subcode,
        authorid_fld: this._user.getUserID(),
        content_fld: this.content,
      }
    }
    this._ds._httpRequest('addreply', load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.forumContent.unshift(dt.payload[0]);
      this.content = '';
      // this.closeDialog(dt.payload);
    }, er => {
      er = this._user._decrypt(er.error.a);
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
        this.forumContent.splice(i, 1);
      }
    });
  }

  backToSubforums(): void {
    this._location.back();
  }

}

