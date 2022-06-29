import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-news-comments',
  templateUrl: './news-comments.component.html',
  styleUrls: ['./news-comments.component.scss']
})
export class NewsCommentsComponent implements OnInit {
  newscomments: any = [];
  count: number;
  recipientcode: any;
  commentcode: any;
  commentcontent: any;
  i: any;
  replyobject:any=[];

  constructor(public _user:UserService, public _ds:DataService,@Inject(MAT_DIALOG_DATA) public data: any, private dialogReg: MatDialogRef<DialogComponent>,public dialog: MatDialog, private _snackbar:MatSnackBar) { }

  ngOnInit(): void {
    this.getcomments();
    this.count = this.data.commentcnt;
    // console.log(this.data);
    
    
  }

  replystatus:number = 0;
  editstatus:number = 0;

  getcomments(){
    this._user.setLoading(true);
    this._ds._httpRequest('getccomment',{acode:this.data.acode},1).subscribe((data:any)=>{
      data = this._user._decrypt(data.a);
      this.newscomments = data.payload;
      // console.log(this.newscomments);
      
      for (let i = 0; i < this.newscomments.length; i++) {
        if (this.newscomments[i].reply != null) {
          for (let index = 0; index < this.newscomments[i].reply.length; index++) {
            if (this.newscomments[i].commentcode_fld == this.newscomments[i].reply[index].actioncode_fld) {
              this.replyobject.push(this.newscomments[i].reply[index]);
                
                
            }
            
          }
          
        }
        
      }
      this._user.setLoading(false);
      // console.log(this.newscomments,this._user.getUserID());
      
      // console.log(data);
    },er=>{
      er = this._user._decrypt(er.error.a);
      this.newscomments = [];
      this.count = 0;
      this._user.setLoading(false);
      // console.log(er);
      
    })
  }

  addcomment(e){
    e.preventDefault();
    this._user.setLoadingInput(true);
    
    let content = e.target[0].value;
    // console.log(content);
    
    if (content == '' || content == undefined || content == null) {
      this._snackbar.open("Please  write a content for your comment.",null,{duration:1500});
      this._user.setLoadingInput(false);
    }else{
      let load = {
        data:{
          // classcode_fld:this._user.getSelectedClass().classcode_fld,
          authorid_fld : this._user.getUserID(),
          actioncode_fld:this.data.acode,
          content_fld : content,
          withfile_fld: 0,
          dir_fld : ''
        },
        notif:{
          id:this._user.getUserID(),
          recipient: this._user.getUserID(),
          message: this._user.getFullname()+' posted a comment in news.',
          module: 'news'
        }
      }
      // console.log(load);
      
      this._ds._httpRequest('addcomment',load,1).subscribe((data:any)=>{
        data = this._user._decrypt(data.a);
        // this.getcomments();
        e.target[0].value  = null;
        this.newscomments.push(data.payload[0]);
        this._user.setLoadingInput(false);
        // console.log(data.payload);
      },er=>{
        er = this._user._decrypt(er.error.a);
        this._user.setLoadingInput(false);
        // console.log(er);
        
      })
    }
  }

  deletecomment(index,newscode , option){
    let condel
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        option: option,
        isConfirmed: condel
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result.data,newscode);
      
      if (result.data) {
        // console.log(newscode);
        
        let load = {
          
          data:{
            authorid_fld:this._user.getUserID(),
            isdeleted_fld:1
          },
          notif:{
            id:this._user.getUserID(),
            recipient: this._user.getUserID(),
            message: this._user.getFullname()+' deleted a comment in news',
            module: 'news'
          }  
        }
        this._ds._httpRequest('editcomm/'+newscode, load , 1).subscribe((res) => {
          res = this._user._decrypt(res.a);
          // console.log(res);
        }, er => {
          er = this._user._decrypt(er.error.a);
          // console.log("here");
          this.replyobject = [];
          this.getcomments();
              
        })
      }
    });
  }
  edit(index,code,content){
    this.editstatus = 1;
    this.replystatus = 3;
    this.commentcode = code;
    this.commentcontent = content;
    this.i = index;
    // console.log(index,code,content);
    
  }
  cancelEdit(){
    this.editstatus = 0;
    this.replystatus = 0;
  }

  editComment(e){
    e.preventDefault();
    this._user.setLoadingInput(true);
    let commentcontent = e.target[0].value;
    if (commentcontent == '' || commentcontent == undefined || commentcontent == null) {
      this._snackbar.open("Please  write a content for your comment.",null,{duration:1500});
      this._user.setLoadingInput(false);
      // console.log("put commentcontent");
    }else{
      let load = {
        data:{
          // classcode_fld:this._user.getSelectedClass().classcode_fld,
          authorid_fld:this._user.getUserID(),
          content_fld:commentcontent
        },
        notif:{
          id:this._user.getUserID(),
          recipient: this._user.getUserID(),
          message: this._user.getFullname()+' edited a comment in news.',
          module: 'news'
        }
  
      }
      // console.log(load);
      
      this._ds._httpRequest('editcomm/'+this.commentcode, load , 1).subscribe((res) => {
        res = this._user._decrypt(res.a);
        this.newscomments[this.i] = res.payload[0];  
        this.editstatus = 0; 
        this.replystatus = 0;
        this._user.setLoadingInput(false);
      }, er => {
        let err = this._user._decrypt(er.error.a);
        this._user.setLoadingInput(false);
        // console.log(err);     
      })
    }
  }

  reply(authorid_fld,actioncode_fld){
    this.replystatus = 1;
    this.editstatus = 4;
    this.recipientcode = actioncode_fld;
  }

  addReply(e){
    e.preventDefault();
    this._user.setLoadingInput(true);
    let replycontent = e.target[0].value;
    // console.log(replycontent);
    
    if (replycontent == '' || replycontent == undefined || replycontent == null) {
      this._snackbar.open("Please  write a content for your reply.",null,{duration:1500});
      this._user.setLoadingInput(false);
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
          message: this._user.getFullname()+' added a reply in news.',
          module: 'news'
        }
      }
      // console.log(load);
      
      this._ds._httpRequest('addcomment',load,1).subscribe((data:any)=>{
        data = this._user._decrypt(data.a);
        // console.log(data);
        this.replyobject = [];
        this.getcomments();   
        // this.replyobject.unshift(data.payload[0]);
        // console.log(this.replyobject);
        
        
        e.target[0].value  = null;
        this.replystatus = 0;
        this.editstatus = 0;
        this._user.setLoadingInput(false);
        // this.postcomments.unshift(this._user._convert(data.payload[0]));
      },er=>{
        er = this._user._decrypt(er.error.a);
        this._user.setLoadingInput(false);

        
      })
    }
    
  }

  cancelreply(){
    this.replystatus = 0;
  }
  showReply(i){
    var x = document.getElementById('replydiv'+i);
    x.style.display === "none" ? x.style.display = "block" : x.style.display = "none";

    

  }
  editthis(index,code,content){
    // console.log(index);
    
    this.editstatus = 3;
    this.replystatus = 3;
    this.commentcode = code;
    this.commentcontent = content;
    this.i = index;

  }

  editReply(e){
    e.preventDefault();
    this._user.setLoadingInput(true);
    let commentcontent = e.target[0].value;
    if (commentcontent == '' || commentcontent == undefined || commentcontent == null) {
      this._snackbar.open("Please  write a content for your reply.",null,{duration:1500});
      this._user.setLoadingInput(false);
      // console.log("put commentcontent");
    }else{
      let load = {
        data:{
        authorid_fld:this._user.getUserID(),
        content_fld:commentcontent
        },
        notif:{
          id:this._user.getUserID(),
          recipient: this._user.getUserID(),
          message: this._user.getFullname()+' edited a reply in news.',
          module: 'news'
        }
  
      }
      this._ds._httpRequest('editcomm/'+this.commentcode, load , 1).subscribe((res) => {
        res = this._user._decrypt(res.a);
        this.replyobject[this.i] = res.payload[0];  
        this.editstatus = 0; 
        this.replystatus = 0;
        this._user.setLoadingInput(false);
      }, er => {
        let err = this._user._decrypt(er.error.a);
        this._user.setLoadingInput(false); 
      })
    }
    
  }

  cancelEditReply(){
    this.editstatus = 0;
    this.replystatus = 0;
  }

  

}
