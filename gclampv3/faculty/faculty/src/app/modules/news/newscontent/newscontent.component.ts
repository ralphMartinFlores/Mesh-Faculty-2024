import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ViewDataOnlyComponent } from 'src/app/shared/components/view-data-only/view-data-only.component';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { CrudNewsCommentsComponent } from 'src/app/shared/components/crud-news-comments/crud-news-comments.component';

@Component({
  selector: 'app-newscontent',
  templateUrl: './newscontent.component.html',
  styleUrls: ['./newscontent.component.scss']
})
export class NewscontentComponent implements OnInit, OnDestroy {

  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  showModal: boolean = true;
  newsContent: any = this._user.getNews();
  announcementObj = [];
  imageRandom = "?v=" + Math.random();
  constructor(
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private _router: Router,
    public _user: UserService,
    public _ds: DataService
  ) { }

  ngOnInit(): void {
    this.imageRandom = this.imageRandom.toString();
    this.getAnnouncements();
    this.newsContent = this.newsContent;
  }

  ngOnDestroy(): void {
    window.sessionStorage.removeItem(btoa('news'));
  }

  Imagepreview(item) {
    let data = {
      "type": 'Previewimage',
      "img": item.imgdir_fld
    };

    const dialogRef = this.dialog.open(ViewDataOnlyComponent, {
      panelClass: 'csss-modalbox',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: data
    });

    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('98%', 'auto');
      } else {
        dialogRef.updateSize('auto', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();

    });
  }

  opencomment() {
    let data = {
      type: 'newscomment',
      data: this.newsContent[0]
    };
    const dialogRef = this.dialog.open(CrudNewsCommentsComponent, {
      width: '100%',
      height: '100%',
      data: data
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('100%', 'auto');
      } else {
        dialogRef.updateSize('50%', 'auto');
        // dialogRef.updatePosition({
        //   top: `0px`,
        //   right: `0px`
        // });
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
      this.newsContent[0].commentcount = result;
    });
  }


  getAnnouncements() {
    this._ds._httpRequest('getannounce', { dept: this._user.getUserDept() }, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.announcementObj = dt.payload;
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }


  show() {
    this.showModal = true; // Show-Hide Modal Check

  }
  //Bootstrap Modal Close event
  hide() {
    this.showModal = false;
  }

  viewAnn(a) {
    this.newsContent = [{
      announcecode_fld: a.announcecode_fld,
      commentcount: a.commentcount,
      content_fld: a.content_fld,
      datetime_fld: a.datetime_fld,
      dtedit_fld: a.dtedit_fld,
      imgdir_fld: a.imgdir_fld,
      recipientcode_fld: a.recipientcode_fld,
      title_fld: a.title_fld,
      withimg_fld: a.withimg_fld
    }];
  }
}
