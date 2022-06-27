import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { ForumAddComponent } from 'src/app/components/forum/forum-add/forum-add.component';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { UploadsService } from 'src/app/services/uploads.service';

@Component({
  selector: 'app-forum-sub',
  templateUrl: './forum-sub.component.html',
  styleUrls: ['./forum-sub.component.scss']
})
export class ForumSubComponent implements OnInit {
  subForumContent: any = [];
  mainforumcontent: any = [];
  forumcode;

  constructor(public _upload:UploadsService,public _ds: DataService, private ar: ActivatedRoute, public _user: UserService, private dialog: MatDialog,  private breakpointObserver: BreakpointObserver) { }

  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);

  ngOnInit(): void {
    this.getSubforum();
  }

  getSubforum() {
    let mainforum = this._user.getMainForums();
    
   
    
    this.ar.paramMap.subscribe((p) => { this.forumcode = p.get('id'); });
    for (let i = 0; i < mainforum.length; i++) {
      if (mainforum[i].forumcode_fld == this.forumcode) {
        this.mainforumcontent.push(mainforum[i]);
      }
    }
    // console.log(this.forumcode);
    
    this._ds._httpRequest('getsubforum', { forumcode: this.forumcode }, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.subForumContent = dt.payload;      
    }, er => {
      er = this._user._decrypt(er.error.a);
    })
  }

  gotoContent(s: Object) {
    this._user.setSubForums(s);
  }

  addSubForum() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%',
    dialogConfig.height = '100%',
    dialogConfig.maxWidth = '100vw',
    dialogConfig.maxHeight = '100vh',
    dialogConfig.panelClass = 'dialogpadding',
    dialogConfig.data = {
      type: 'subforum',
      code:this.forumcode
    }
    const dialogRef = this.dialog.open(ForumAddComponent, dialogConfig);
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('99%', 'auto');
      } else {
        dialogRef.updateSize('40%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result.data);
      if (result.data) {
        this._ds._httpRequest('addsubforum',result.data,1).subscribe((data:any)=>{
          data = this._user._decrypt(data.a);
          this.subForumContent.unshift(data.payload[0]);
          // console.log(data);
          
        },er=>{
          er = this._user._decrypt(er.error.a);
          // console.log(er);
          
        })
      }

    });

  }


}
