import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { CrudNewsCommentsComponent } from 'src/app/shared/components/crud-news-comments/crud-news-comments.component';


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  showLoader: boolean = true;
  announcementObj: any = [];
  latestObj: any = [];
  allAnnounce: any = [];
  filter: string = '';
  imageRandom = "?v=" + Math.random();

  constructor(private _router: Router,
    public _user: UserService, public _ds: DataService,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.initializeComponents();
    this.imageRandom = this.imageRandom.toString();
  }


  initializeComponents() {
    this.getAnnouncements();
  }


  getAnnouncements() {

    this._ds._httpRequest('getannounce', { dept: this._user.getUserDept() }, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.announcementObj = dt.payload;
      this.allAnnounce = dt.payload;
      this.latestObj.push(dt.payload[0]);
      this.announcementObj = this.announcementObj.splice(0, 1);
      this.showLoader = false;
    }, er => {
      er = this._user._decrypt(er.error.a);
      this.allAnnounce = er.payload;
      this.showLoader = false
    });
  }



  gotoInnerContent(data) {
    this._router.navigate(['./main/news', data.announcecode_fld]);
    this._user.setNews(([data]));
  }


  filterlist() {
    let results: any = []
    if (this.filter != '') {
      this.allAnnounce.forEach(index => {
        if (index.title_fld.toLowerCase().includes(this.filter.toLowerCase()) || index.content_fld.toLowerCase().includes(this.filter.toLowerCase())) {
          results.push(index);
        }
      })
      this.announcementObj = results;
    } else {
      this.announcementObj = this.allAnnounce;
    }
  }
}
