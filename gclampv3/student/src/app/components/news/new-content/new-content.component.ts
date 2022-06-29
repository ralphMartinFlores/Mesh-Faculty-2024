import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';
import { NewsCommentsComponent } from '../news-comments/news-comments.component';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-new-content',
  templateUrl: './new-content.component.html',
  styleUrls: ['./new-content.component.scss']
})
export class NewContentComponent implements OnInit {

  announcement = [];
  randomannounce = [];
  randomNumber: any;

  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  image: any;
  randimage: any = [];

  constructor(private _router: Router, private user: UserService, public _ds: DataService, public dialog: MatDialog, private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    let a = this.user.getContentNews();
    this.announcement = JSON.parse(a);
    // console.log(this.announcement);
    
    this.randomNumber = Math.floor(Math.random() * 3) + 1;
    this.getimg();
    this.getAnnouncement();
  }

  viewAnnouncement(data) {
    this._router.navigate(['./main/news', data['announcecode_fld']]);
    this.announcement = [{
      announcecode_fld: data['announcecode_fld'],
      content_fld: data['content_fld'],
      imgdir_fld: data['imgdir_fld'],
      title_fld: data['title_fld'],
      withimg_fld: data['withimg_fld'],
      recipientcode_fld: data['recipientcode_fld'],
      timestamp_fld: data['timestamp_fld']
    }];
    // console.log(this.announcement);
    
  }

  splitFilestring(filestring: string) {
    let arr1 = filestring.split(':');
    let filearray: { name: string; link: string,path:string }[] = [];
    for (let i = 0; i < arr1.length; i++) {
      let arr2 = arr1[i].split('?');
      filearray.push({ name: arr2[0], link: this._ds.fileUrl + arr2[0], path: arr2[1] });
    }
    return filearray;
  }

  getimg() {
    let imagepath = this.splitFilestring(this.announcement[0]['imgdir_fld']);
    this.image = imagepath[0].link;    
    return this.image;
  }

  getAnnouncement() {
    this._ds._httpRequest('getannounce', { dept: this.user.getDepartment(), program: this.user.getProgram() }, 1).subscribe((data: any) => {
      data = this.user._decrypt(data.a);
        this.randomannounce = data.payload;
        // console.log(this.randomannounce);
        
        for (let i = 0; i < this.randomannounce.length; i++) {
          if (this.randomannounce[i].withimg_fld == 1) {
            this.randimage = this._ds.fileUrl + this.randomannounce[i].imgdir_fld
           
            // this.randimage = imagepath[i].link
            // console.log(imagepath[i].link);
           
          }
          
        }
        

    })
  }

  openComments(acode,count){

    let data = {
      acode: acode,
      commentcnt: count
    };

    const dialogRef = this.dialog.open(NewsCommentsComponent, {
      panelClass: '',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data:data

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


}
