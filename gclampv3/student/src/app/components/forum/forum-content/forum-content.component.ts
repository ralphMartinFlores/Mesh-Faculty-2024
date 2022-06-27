import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { ForumEditComponent } from 'src/app/components/forum/forum-edit/forum-edit.component';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { UploadsService } from 'src/app/services/uploads.service';
import { QuestService } from 'src/app/services/quest.service';
import { Crud, fldNames } from 'src/app/services/enum';

@Component({
  selector: 'app-forum-content',
  templateUrl: './forum-content.component.html',
  styleUrls: ['./forum-content.component.scss']
})
export class ForumContentComponent implements OnInit {
  contents: any = [];
  count: any;
  replystatus:number = 0;
  recipientcode: any;

  constructor(public _upload:UploadsService,
    public ar: ActivatedRoute, public _ds: DataService, 
    private router: Router, public _user: UserService, 
    public dialog: MatDialog, 
    private breakpointObserver: BreakpointObserver, 
    public _quest:QuestService
    ) { }

  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);

  ngOnInit(): void {
    this.getContents();
  }
  

  getContents(){
    this._ds._httpRequest('getsubcontent',{subcode:this._user.getSubForums().subcode_fld},1).subscribe((data:any)=>{
      data = this._user._decrypt(data.a);
      this.contents = data.payload;
      this.count = this.contents.length;
      console.log(this.contents);
      
    },er=>{
      er = this._user._decrypt(er.error.a);
      // console.log(er);
      
      this.contents = [];
      this.count = 0;
      // console.log(er);
      
    })
  }

  addContent(e){
    e.preventDefault();
    this._user.setLoadingInput(true);
    let content = e.target[0].value;
    let data = {
      data:{
        authorid_fld:this._user.getUserID(),
        content_fld: content,
        subcode_fld:this._user.getSubForums().subcode_fld
      },
      notif:{
        id:this._user.getUserID(),
        recipient: this._user.getUserID(),
        message: this._user.getFullname()+' added a comment in a thread.',
        module: 'forums'
      }
      
    }
    // console.log(data);
    this._ds._httpRequest('addreply',data,1).subscribe((data:any)=>{
      data = this._user._decrypt(data.a);
      this.contents.push(data.payload[0]);
      this.count = this.count + 1;
      e.target[0].value = '';
      this._user.setLoadingInput(false);
      // console.log(data.payload);

      //Update Quest User Data
      this._quest.UpdateCountAchievement(Crud.ADD,fldNames.cifcnt_fld);
      
      
    })
  }

  delcomment(forumcode , option){
    let condel
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'dialogpadding'
    dialogConfig.data = {
      option: option,
      isConfirmed: condel
    }
    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result.data,forumcode);
      
      if (result.data) {
        let load = {
          data:{
            isdeleted_fld:1
          },
          notif:{
            id:this._user.getUserID(),
            recipient: this._user.getUserID(),
            message: this._user.getFullname()+' deleted a comment in forum.',
            module: 'forum'
          }          
        }
        this._ds._httpRequest('editreply/'+forumcode, load , 1).subscribe((res) => {
          res = this._user._decrypt(res.a);
          // console.log(res);
          
        }, er => {
          let err = this._user._decrypt(er.error.a);
          this.getContents();
          // console.log(err);
         
         
        })
      }
    });
  }

  editSubForum(index,code,content) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%',
    dialogConfig.height = '100%',
    dialogConfig.maxWidth = '100vw',
    dialogConfig.maxHeight = '100vh',
    dialogConfig.panelClass = 'dialogpadding'
    dialogConfig.data = {
      content:content
    }
    const dialogRef = this.dialog.open(ForumEditComponent, dialogConfig);
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
        this._ds._httpRequest('editreply/'+code, result.data , 1).subscribe((res) => {
          res = this._user._decrypt(res.a);
          this.contents[index] = res.payload[0];
          // console.log(res);
          
        }, er => {
          let err = this._user._decrypt(er.error.a);
          // this.getContents();
          // console.log(err);
         
         
        })
      }

    });

  }
  addReply(e){
    e.preventDefault();
    
    let replycontent = e.target[0].value;
    // console.log(replycontent);
    
    if (replycontent == '' || replycontent == undefined || replycontent == null) {
      
      // console.log("put replycontent");
    }else{
      let load = {
        
        data:{
          // classcode_fld:this._user.getSelectedClass().classcode_fld,
          authorid_fld : this._user.getUserID(),
          actioncode_fld:this.recipientcode,
          content_fld : replycontent,
          withfile_fld: 0,
          dir_fld : ''
        },
        notif:{
          id:this._user.getUserID(),
          recipient: this._user.getUserID(),
          message: this._user.getFullname()+' added a reply in a thread.',
          module: 'forums'
        }
      }
      // console.log(load);
      
      this._ds._httpRequest('addcomment',load,1).subscribe((data:any)=>{
        data = this._user._decrypt(data.a);
        // this.getcomments();
        // console.log(data);
        
        e.target[0].value  = null;
        this.replystatus = 0;
        // this.postcomments.unshift(this._user._convert(data.payload[0]));
      },er=>{
        er = this._user._decrypt(er.error.a);

        
      })
    }
    
  }

  replycontent(authorid,code){
    this.replystatus = 1;
    this.recipientcode = code;
    // console.log(authorid,code);
  }

  cancelreply(){
    this.replystatus = 0;
  }

}
