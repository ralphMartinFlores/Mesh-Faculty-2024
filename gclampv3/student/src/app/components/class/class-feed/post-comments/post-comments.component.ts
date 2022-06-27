import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { Crud, fldNames } from 'src/app/services/enum';
import { QuestService } from 'src/app/services/quest.service';
import { UploadsService } from 'src/app/services/uploads.service';
import { UserService } from 'src/app/services/user.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.scss']
})
export class PostCommentsComponent implements OnInit {
  postcomments: any = [];
  count: any;
  replystatus:number = 0;
  editstatus:number = 0;
  recipientcode: any;
  commentcode: any;
  commentcontent: any;
  i: any;
  replyobject: any = [];
  commentcodeforreply: any;
  showLoader : boolean = true;


  constructor(public _upload:UploadsService,
    public _user:UserService, 
    public _ds:DataService,@Inject(MAT_DIALOG_DATA) public data: any, 
    private dialogReg: MatDialogRef<DialogComponent>,
    public dialog: MatDialog, 
    public _quest:QuestService
    ) { }

  ngOnInit(): void {
    this.getcomments();    
    this.count = this.data.commentcnt;
  }

  getcomments(){
    this._user.setLoading(true);
    this._ds._httpRequest('getccomment',{acode:this.data.acode},1).subscribe((data:any)=>{
      data = this._user._decrypt(data.a);
      this.postcomments = data.payload;
      this._user.setLoading(false);
      // this.showLoader = false;
      // console.log(this.replyobject);
    },er=>{
      er = this._user._decrypt(er.error.a);
      this._user.setLoading(false);
      this.postcomments = [];
      this.count = 0;
    })
  }
  

  addComment(e){
    e.preventDefault();
    
    let content = e.target[0].value;    
    if (content == '' || content == undefined || content == null) {
    }else{
      let load = {
        data:{
          classcode_fld:this._user.getSelectedClass().classcode_fld,
          authorid_fld : this._user.getUserID(),
          actioncode_fld:this.data.acode,
          content_fld : content,
          withfile_fld: 0,
          dir_fld : ''
        },
        notif:{
          id:this._user.getUserID(),
          recipient: this._user.getSelectedClass().empcode_fld,
          message: this._user.getFullname()+' added a comment on '+this._user.getSelectedClass().subjdesc_fld,
          module: 'classroom'
        }
        
      }
      // console.log(load);
      
      this._ds._httpRequest('addcomment',load,1).subscribe((data:any)=>{
        data = this._user._decrypt(data.a);
        // this.getcomments();
        e.target[0].value  = null;
        this.postcomments.push(data.payload[0]);
        this.count = this.count + 1;

        //Update Quest User Data
        this._quest.UpdateCountAchievement(Crud.ADD,fldNames.ciccnt_fld);
        // console.log(data.payload);
      },er=>{
        er = this._user._decrypt(er.error.a);
        // console.log(er);
        
      })
    }
  }

  addReply(e,comments,i){
    e.preventDefault();
    
    let replycontent = e.target[0].value;
    // console.log(replycontent);
    
    if (replycontent == '' || replycontent == undefined || replycontent == null) {
      // console.log("put replycontent");
    }else{
      let load = {
        data:{
          classcode_fld:this._user.getSelectedClass().classcode_fld,
          authorid_fld : this._user.getUserID(),
          actioncode_fld:comments.commentcode_fld,
          content_fld : replycontent,
          withfile_fld: 0,
          dir_fld : ''
        },
        notif:{
          id:this._user.getUserID(),
          recipient: this._user.getSelectedClass().empcode_fld,
          message: this._user.getFullname()+' replied to '+ comments.commentcode_fld,
          module: 'classroom'
        }
      }
      // console.log(load);
      
      this._ds._httpRequest('addcomment',load,1).subscribe((data:any)=>{
        data = this._user._decrypt(data.a); 
        if (this.postcomments[i].reply == null) {
          this.postcomments[i].reply = [];
          this.postcomments[i].reply.push(data.payload[0]);
        } else {
          this.postcomments[i].reply.push(data.payload[0]);
        }       
        e.target[0].value  = null;
        this.replystatus = 0;
        this.editstatus = 0;
        // this.postcomments.unshift(this._user._convert(data.payload[0]));
      },er=>{
        er = this._user._decrypt(er.error.a);

        
      })
    }
    
  }

  showReply(i){
    var x = document.getElementById('replydiv'+i);
    x.style.display === "none" ? x.style.display = "block" : x.style.display = "none";  
    let j = document.getElementById('replybtn' + i);
    j.style.display === "none" ? j.style.display = "block" : j.style.display = "none"; 
  }

  // reply(authorid_fld,actioncode_fld){
  //   this.replystatus = 1;
  //   this.editstatus = 4;
  //   this.recipientcode = actioncode_fld;    
  // }

  cancelreply(){
    this.replystatus = 0;
  }

  edit(index,code,content){
    
    this.commentcode = code;
    this.i = index;
    (<HTMLInputElement>document.getElementById('content_fld' + index)).value = content;
    let editbox = document.getElementById('edit-box' + index);
    let comments = document.getElementById('comments' + index);
    comments.style.display === "none" ? comments.style.display = "block" : comments.style.display = "none";
   
    editbox.style.display === "none" ? editbox.style.display = "block" : editbox.style.display = "none";
    
  }
  editComment(e){
    e.preventDefault();
    let commentcontent = e.target[0].value;
    if (commentcontent == '' || commentcontent == undefined || commentcontent == null) {
      // console.log("put commentcontent");
    }else{
      let load = {
        data:{
          classcode_fld:this._user.getSelectedClass().classcode_fld,
          authorid_fld:this._user.getUserID(),
          content_fld:commentcontent
        },
        notif:{
          id:this._user.getUserID(),
          recipient: this._user.getSelectedClass().empcode_fld,
          message: this._user.getFullname()+' edited a comment '+this._user.getSelectedClass().classcode_fld,
          module: 'classroom'
        }
  
      }
      this._ds._httpRequest('editcomm/'+this.commentcode, load , 1).subscribe((res) => {
        res = this._user._decrypt(res.a);        
        // console.log(res);
              
        this.postcomments[this.i] = res.payload[0];  
        // this.editstatus = 0; 
        // this.replystatus = 0;
      }, er => {
        let err = this._user._decrypt(er.error.a);
        // console.log(err);     
      })
    }
  }
  cancelEdit(i){
    let editbox = document.getElementById('edit-box' + i);
    let comments = document.getElementById('comments' + i);
    let img = document.getElementById('img-container' + i);
    editbox.style.display === "flex" ? editbox.style.display = "none" : editbox.style.display = "none";
    comments.style.display = 'block';
    img.style.display = 'block';
  }


  deletecomment(index,commentcode , option){
    let condel
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    if (this._user.isMobile()) {
      dialogConfig.maxHeight = '90vw';
      dialogConfig.minHeight = 'auto';
      dialogConfig.maxWidth = '70vw';
      dialogConfig.maxWidth = '90vw';
    } else {
      dialogConfig.minHeight = '20vh';
      dialogConfig.minWidth = '15vw';
    }
    dialogConfig.data = {
      option:option,
      isConfirmed:condel
    }
    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {      
      if (result.data) {        
        let load = {
          data:{
            classcode_fld:this._user.getSelectedClass().classcode_fld,
            authorid_fld:this._user.getUserID(),
            isdeleted_fld:1
          },
          notif:{
            id:this._user.getUserID(),
            recipient: this._user.getSelectedClass().empcode_fld,
            message: this._user.getFullname()+' deleted a comment '+this._user.getSelectedClass().classcode_fld,
            module: 'classroom'
          }

          
        }
        this._ds._httpRequest('editcomm/'+commentcode, load , 1).subscribe((res) => {
          res = this._user._decrypt(res.a);
          // console.log(res);
        }, er => {
          er = this._user._decrypt(er.error.a);  
          this.postcomments.splice(index,1);
          this.count = this.count - 1;            
        })
      }
    });
  }

  deletereply(index,j,commentcode , option){
    let condel
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    if (this._user.isMobile()) {
      dialogConfig.maxHeight = '90vw';
      dialogConfig.minHeight = 'auto';
      dialogConfig.minWidth = '70vw';
      dialogConfig.maxWidth = '90vw';
    } else {
      dialogConfig.minHeight = '20vh';
      dialogConfig.minWidth = '15vw';
    }
    dialogConfig.data = {
      option:option,
      isConfirmed:condel
    }
    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result.data);
      
      if (result.data) {
        // console.log(commentcode);
        
        let load = {
          data:{
            classcode_fld:this._user.getSelectedClass().classcode_fld,
            authorid_fld:this._user.getUserID(),
            isdeleted_fld:1
          },
          notif:{
            id:this._user.getUserID(),
            recipient: this._user.getSelectedClass().empcode_fld,
            message: this._user.getFullname()+' deleted a comment '+this._user.getSelectedClass().classcode_fld,
            module: 'classroom'
          }

          
        }
        this._ds._httpRequest('editcomm/'+commentcode, load , 1).subscribe((res) => {
          res = this._user._decrypt(res.a);
          // console.log(res);
        }, er => {
          er = this._user._decrypt(er.error.a);     
          this.postcomments[index].reply.splice(j,1);
         
        })
      }
    });
  }

  editthis(index,reply,j){
    console.log(index,reply,j);
    
    // console.log(reply.content_fld);
    this.commentcode = reply.commentcode_fld;
    this.commentcontent = reply.content_fld;
    this.i = j;
    (<HTMLInputElement>document.getElementById(index + 'reply_content_fld' + j)).value = this.commentcontent;    
    let reditbox = document.getElementById(index + 'redit-box' + j);
    
    reditbox.style.display === "none" ? reditbox.style.display = "flex" : reditbox.style.display = "none";

    
    // this.editstatus = 3;
    

  }

  editReply(e,comments,i){
    e.preventDefault();
    let commentcontent = e.target[0].value;
    if (commentcontent == '' || commentcontent == undefined || commentcontent == null) {
      // console.log("put commentcontent");
    }else{
      let load = {
        data:{
          classcode_fld:this._user.getSelectedClass().classcode_fld,
          authorid_fld:this._user.getUserID(),
          content_fld:commentcontent
        },
        notif:{
          id:this._user.getUserID(),
          recipient: this._user.getSelectedClass().empcode_fld,
          message: this._user.getFullname()+' edited a reply '+this._user.getSelectedClass().classcode_fld,
          module: 'classroom'
        }
  
      }
      this._ds._httpRequest('editcomm/'+comments.commentcode_fld, load , 1).subscribe((res) => {
        res = this._user._decrypt(res.a);
        this.postcomments[i].reply[this.i] = res.payload[0];  
        this.editstatus = 0; 
      }, er => {
        let err = this._user._decrypt(er.error.a);
        // console.log(err);     
      })
    }
    
  }

  cancelEditReply(i,j){
    let replybox = document.getElementById(i + 'replybox' + j);
    let redit = document.getElementById(i + 'redit-box' + j);
    redit.style.display === "flex" ? redit.style.display = "none" : redit.style.display = "none";
    replybox.style.display = 'flex';
    // this.editstatus = 0;
    // this.replystatus = 0;
  }



}
