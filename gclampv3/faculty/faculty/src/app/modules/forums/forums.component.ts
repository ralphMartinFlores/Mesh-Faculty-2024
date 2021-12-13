import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { staggereffect } from 'src/app/shared/animation/animation';
import { CRUDForumsComponent } from 'src/app/shared/components/crud-forums/crud-forums.component';
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';
import { DeleteRecordComponent } from 'src/app/shared/components/delete-record/delete-record.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.scss'],
  animations: [
    staggereffect
  ]
})
export class ForumsComponent implements OnInit {
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);

  ForumsObject: any = [];
  allforum: any = [];
  filter: string = '';
  showLoader: boolean;
  data: number = 0;

  constructor(public dialog: MatDialog, private _router: Router,
    private breakpointObserver: BreakpointObserver,
    public _user: UserService,
    public _ds: DataService) { }

  ngOnInit(): void {
    this.intializeComponents();
  }


  intializeComponents() {
    this.getForumTopic();
  }

  getForumTopic() {
    this.showLoader = true;
    this._ds._httpRequest('getforumtopic', { dept: this._user.getUserDept() }, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.ForumsObject = dt.payload;
      this.allforum = dt.payload;
      this.showLoader = false;
    }, er => {
      er = this._user._decrypt(er.error.a);
      this.allforum = er.payload;
      this.showLoader = false;

    });
  }

  addForum() {
    let data = {
      "type": 'mainforum',
    };
    const dialogRef = this.dialog.open(CRUDForumsComponent, {
      panelClass: '',
      maxWidth: '100vw',
      maxHeight: '100vh',
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
        this.ForumsObject.push(result[0]);
      }
    });
  }

  gotoSelectedForum(item) {
    window.sessionStorage.removeItem(btoa('subforumtopic'));
    this._user.setSelectedForum(([item]));
    this._router.navigate(['main/forums', item.forumcode_fld]);
  }

  // filterlist() {
  //   let results: any = []
  //   if (this.filter != '') {
  //     this.ForumsObject.forEach(index => {
  //       if (index.forumtitle_fld.toLowerCase().includes(this.filter.toLowerCase()) || index.forumdesc_fld.toLowerCase().includes(this.filter.toLowerCase())) {
  //         results.push(index);
  //       }
  //     })
  //     this.ForumsObject = results;
  //   } else {
  //     this.getForumTopic();
  //   }
  // }

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
        this.ForumsObject.splice(i, 1);
      }
    });
  }

  editTopic(e, i) {
    let data = {
      type: 'editmainforum',
      data: e,
    };
    const dialogRef = this.dialog.open(CRUDForumsComponent, {
      panelClass: '',
      maxWidth: '100vw',
      maxHeight: '100vh',
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
      if (result != undefined) {
        this.ForumsObject[i] = result[0];
      }
      responsiveDialogSubscription.unsubscribe();

    });
  }


  filterlist() {
    let results: any = []
    if (this.filter != '') {
      this.allforum.forEach(index => {
        if (index.forumtitle_fld.toLowerCase().includes(this.filter.toLowerCase()) || index.forumdesc_fld.toLowerCase().includes(this.filter.toLowerCase())) {
          results.push(index);
        }
      })
      this.ForumsObject = results;
    } else {
      this.ForumsObject = this.allforum;
    }
  }
}
