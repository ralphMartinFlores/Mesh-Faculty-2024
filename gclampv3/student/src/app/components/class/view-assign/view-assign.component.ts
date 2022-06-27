import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { ViewQuizComponent } from '../view-quiz/view-quiz.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { UploadsService } from 'src/app/services/uploads.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResourcePreviewComponent } from 'src/app/shared/resource-preview/resource-preview.component';
import { QuestService } from 'src/app/services/quest.service';
import { Crud, fldNames } from 'src/app/services/enum';

@Component({
  selector: 'app-view-assign',
  templateUrl: './view-assign.component.html',
  styleUrls: ['./view-assign.component.scss']
})
export class ViewAssignComponent implements OnInit {
  
  isLoading = 0
  activity: any =[];
  actTitle: any;
  datePosted: any;
  dueDate: any;
  description: any;
  totalScore: any;
  attachments: any;
  withfile: number = 0;
  type: any;
  commentcount: number;
  comments: any =[];
  works: any;
  files:any = [];
  issubmitted: any = 0;
  isscored: any;
  filepathtoupload: any;
  withfileact: number;
  isUploading: boolean = false;
  submittedFiles=[];
  filesToBeUpdated: any=[];
  // saveNewWork: number = 0;
  existingDir: any;
  split: any = [];
  combined: any = [];
  replyobject: any = [];
  replystatus:number = 0;
  recipientcode: any;
  i: any;
  commentcodeforreply: any;
  commentcode: any;
  commentcontent: any;
  actObj: any = [];
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);




  constructor(public _upload:UploadsService,
    public route: Router,
    private breakpointObserver: BreakpointObserver, 
    public dialog: MatDialog, 
    public _ds:DataService, 
    public _user:UserService, 
    public _us: UploadsService, 
    private _snackbar:MatSnackBar,
    public _quest:QuestService
    ) { }

  arr  = this.route.url.split('/');
  questObject = this._user.getQuestData();

  ngOnInit(): void {
    this.getActivity();
    this.getComments();
    this.getWorks();
    
  }

  getActivity(){
    this._ds._httpRequest('getcpost',{classcode:this._user.getSelectedClass().classcode_fld, actcode:this.arr[4],type:'act'},1).subscribe((data:any)=>{
      data = this._user._decrypt(data.a);
      this.actObj = data.payload;  
           
      for (let i = 0; i < this.actObj.length; i++) {
        if (this.arr[4] == this.actObj[i].actcode_fld) {
          this.activity.push(this.actObj[i]);
        }
      }
      
      this.actTitle = this.activity[0].title_fld;
      this.datePosted = this.activity[0].datetime_fld;
      this.dueDate = this.activity[0].deadline_fld;
      this.description = this.activity[0].desc_fld;
      this.totalScore = this.activity[0].totalscore_fld;
      this.attachments = this._upload.splitFilestring(this.activity[0].filedir_fld);       
      this.withfileact = this.activity[0].withfile_fld;
      this.type = this.activity[0].type_fld;      
      this.commentcount = this.activity[0].commentcount;

      
    },er => {
      er = this._user._decrypt(er.error.a);
      this._snackbar.open("Failed to load activity.",null,{duration:1500});
    })
  }

  getComments(){
    let load = {
      acode:this.arr[4]
    }
    this._ds._httpRequest('getccomment',load,1).subscribe((data:any)=>{
      data = this._user._decrypt(data.a);
      
      this.comments = data.payload;
      
    },er=>{
      er = this._user._decrypt(er.error.a);
      this.comments = [];
    })
  }

  getWorks(){
    let load = {
      userid:this._user.getUserID(),
      classcode:this._user.getSelectedClass().classcode_fld,
      actcode:this.arr[4],
      type:'act'
    }    
    this._ds._httpRequest('getstudworks',load,1).subscribe((data:any)=>{
      data = this._user._decrypt(data.a);
      this.works = data.payload;
      
      if (this.works[0].dir_fld == '') {
        this.submittedFiles = [];
      }else{
        this.submittedFiles = this._upload.splitFilestring(this.works[0].dir_fld);
      }
    
      this.existingDir = this.works[0].dir_fld;
      
      this.issubmitted = this.works[0].issubmitted_fld;
      this.isscored = this.works[0].isscored_fld;
      
    },(er) => {
      let err = this._user._decrypt(er.error.a);
    })
  }

  addComment(e){
    this._user.setLoading(true);
    e.preventDefault()
    let textcontent:string = e.target[0].value;    
    if (textcontent == null || textcontent == undefined || textcontent == '') {
      this._user.setLoading(false);
      this._snackbar.open('Please  write a content for your comment.', null, {duration:1500});
    }else{
      let load = {
        data:{
          classcode_fld:this._user.getSelectedClass().classcode_fld,
          authorid_fld : this._user.getUserID(),
          actioncode_fld:this.arr[4],
          content_fld : textcontent,
          withfile_fld: 0,
          dir_fld : ''
        },
        notif:{
          id:this._user.getUserID(),
          recipient: this._user.getSelectedClass().empcode_fld,
          message: this._user.getFullname()+' added a comment on '+this._user.getSelectedClass().classcode_fld,
          module: 'classroom'
        }
      }
      
      this._ds._httpRequest('addcomment',load,1).subscribe((data:any)=>{
        data = this._user._decrypt(data.a);
        e.target[0].value  = null;
        this.commentcount = this.commentcount + 1;
        
        this.comments.unshift(data.payload[0]);
        this._user.setLoading(false);
      })
    }
    
  }

  async addWork(){        
    await this.Filepath().then((filepath:any)=>{
      new Promise<void>(() => {
        let load = {
          data:{
            classcode_fld:this._user.getSelectedClass().classcode_fld,
            actcode_fld: this.arr[4],
            studnum_fld:this._user.getUserID(),
            type_fld:this._user.getSelectedClass().type_fld,
            dir_fld:filepath,
            issubmitted_fld: this.withfile
          },
          notif:{
            id:this._user.getUserID(),
            recipient: this._user.getSelectedClass().empcode_fld,
            message: this._user.getFullname()+' submitted a file on '+ this.actTitle,
            module: 'classroom'
          }
        }
        
        this._ds._httpRequest('addwork',load,1).subscribe((data:any)=>{
          data = this._user._decrypt(data.a);
          this.isUploading = false;
          this.works = data.payload;
          this.files = [];
          this.existingDir = this.works[0].dir_fld;
          this.submittedFiles = this._upload.splitFilestring(this.works[0].dir_fld);
          this.issubmitted = this.works[0].issubmitted_fld;
          this.isscored = this.works[0].isscored_fld;    
          
           //Update Quest User Data
           if (this.questObject.taskcnt_fld_limit > 0) {
            this._quest.UpdateCountAchievement(Crud.ADD,fldNames.taskcnt_fld);
           }
           
        },er => {
          er = this._user._decrypt(er.error.a);
          this.isUploading = false;
        })
      });
    }).catch(e=>{

    });
    
  }

  editComment(index,data,code,options){
    let condel

    let load = {
      option: options,
      isConfirmed: condel,
      data: data
    };

    const dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'dialogpadding',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: load,
      
      disableClose: true,
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('98%', 'auto');
      } else {
        dialogRef.updateSize('30%', 'auto');
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
      if (result.data) {        
        let load = {
          data:{
            classcode_fld:this._user.getSelectedClass().classcode_fld,
            authorid_fld:this._user.getUserID(),
            content_fld:result.data,
            // withfile_fld:0,
            // dir_fld:'',
          },
          notif:{
            id:this._user.getUserID(),
            recipient: this._user.getSelectedClass().empcode_fld,
            message: this._user.getFullname()+' edited a comment on this activity'+ this.actTitle,
            module: 'classroom'
          }
        }
        this._ds._httpRequest('editcomm/'+code, load , 1).subscribe((res) => {
          res = this._user._decrypt(res.a);
          this.comments[index] = res.payload[0];   
        }, er => {
          let err = this._user._decrypt(er.error.a);
          if (err.payload == null) {
            this.getComments();
          }
         
        })
      }
    });   
}

  // Start of uploading files
  getFile(event) {
    let sum: number = 0;
    for (var i = 0; i < event.target.files.length; i++) {
      sum += event.target.files[i].size;
      this.files.push(event.target.files[i]);
    }


   

    if (sum > 30000000) {
      this._snackbar.open((sum / 1048576).toFixed(2).toString() + "File to big error",null,{duration:1500})
       this._snackbar.open('Your total upload file(S) is ' + ((sum / 1048576).toFixed(2).toString()) + 'MB. Please upload only atleast 30MB of file(s)', "", {duration:1500});
      this.files = [];
      (<HTMLInputElement>document.getElementById('files')).value = '';
    }else{
      if (this.files.length > 0) {
        if (this.dueDate < this._user.getDateToday()) {
          this.withfile = 2;
        }else{
          this.withfile = 1;
        }
      }
      (<HTMLInputElement>document.getElementById('files')).value = '';      
    }
  }

 

  deleteDialog(i, option){
    let condel
    const dialogConfig = new MatDialogConfig();
    if (this._user.isMobile()) {
      dialogConfig.maxHeight = '90vw';
      dialogConfig.minHeight = 'auto';
      dialogConfig.minWidth = '70vw';
      dialogConfig.maxWidth = '90vw';
    } else {
      dialogConfig.minHeight = '15vh';
      dialogConfig.minWidth = '15vw';
      dialogConfig.maxHeight = 'auto';
    }
    dialogConfig.data = {
      option: option,
      isConfirmed: condel
    }
    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        this.unlinkedFile(i);
      }
    });
  }

  async unlink(path){
    let load = {dir_fld:path}
    this.isLoading = 1
    return new Promise((resolve,rejects)=>{
      this._ds._httpRequest('deletefile',load,1).subscribe((data:any)=>{
        data = this._user._decrypt(data.a);
        resolve(data.status.remarks);
      },er=>{
        er = this._user._decrypt(er.error.a);
        return new Promise(()=>{
          rejects(er.status.remarks)
        })
      })
    })
  }

  async unlinkedFile(i){
    this._user.setLoading(true);
    let newFiles:any = [];
    await this.unlink(this.submittedFiles[i].path).then(()=>{
      this.submittedFiles.splice(i,1);
      this.submittedFiles.map((e)=>{
        newFiles.push(e.name + '?' + e.path);
      })
      newFiles = newFiles.join(':');
      let load = {
        data:{
          dir_fld:newFiles 
        },
        notif:{
          id:this._user.getUserID(),
          recipient: this._user.getSelectedClass().empcode_fld,
          message: this._user.getFullname()+' remove a file on '+this._user.getSelectedClass().subjdesc_fld,
          module: 'classroom'
        }
        
      }

    let api = `editsubmit/${this.works[0].submitcode_fld}/${this.works[0].actcode_fld}`

      this._ds._httpRequest(api,load,1).subscribe((data:any)=>{
        data = this._user._decrypt(data.a);
        this.existingDir = data.payload[0].dir_fld;
        if (data.payload[0].dir_fld == '') {
          this.withfile = 0
        }else{
          this.withfile = data.payload[0].issubmitted_fld;  
        }     
        this.isLoading = 0

        this._user.setLoading(false);
        
      },er=>{
        er = this._user._decrypt(er.error.a);
        this._user.setLoading(false);
      })
      
    })
    
    
  }

  

  async Filepath(){
    let requestURL = `upload/${this._user.getUserID()}/${this._user.getSettings().acadyear_fld}/${this._user.getSettings().sem_fld}`
    let formdata: FormData;
    formdata = this.uploadFile(this.files);
    return new Promise((resolve, rejects) => {
      this._ds._httpRequest(requestURL, formdata, 3).subscribe((data: any) => {
        data = this._user._decrypt(data.a);        
        resolve(data.payload.filepath);
      }, er => {
        er = this._user._decrypt(er.error.a);        
        rejects(er.error.a)
      });
    })
  }
  
  uploadFile(payload) {
    this.isUploading = true;
    const formData = new FormData();
    for (var i = 0; i < this.files.length; i++) {
      formData.append('file[]', this.files[i]);
    }
    formData.append('payload', JSON.stringify(payload));
    return formData;
  }
  // End of uploading files


  unsubmit(){
    let load ={
      data:{
        dir_fld:this.filepathtoupload,
        issubmitted_fld: 0
      },
      notif:{
        id:this._user.getUserID(),
        recipient: this._user.getSelectedClass().empcode_fld,
        message: this._user.getFullname()+' save a work in '+this._user.getSelectedClass().subjdesc_fld,
        module: 'classroom'
      }  
    }
    let api = `editsubmit/${this.works[0].submitcode_fld}/${this.works[0].actcode_fld}`
    
    this._ds._httpRequest(api,load,1).subscribe((data:any)=>{
      data = this._user._decrypt(data.a)
      this.issubmitted = 0
      this.isUploading = false;
    },er=>{
      er = this._user._decrypt(er.error.a)
    })
  }


  removeFile(i) {
   
    this.files.splice(i, 1);    
    if (this.files.length == 0) {
      this.withfile = 0;
    }
  }



//start of saving activity

  async save(){   
    if (this.files.length != 0) {
      await this.Filepath().then((filepath)=>{
        if (this.existingDir === '') {
          this.filepathtoupload = filepath;          
        }else{
          this.split = this.existingDir.split(':');
          this.split.push(filepath);
          this.combined = this.split.join(':');             
          this.filepathtoupload = this.combined;  
        }   
      }).catch(e=>{
        this.filepathtoupload = '';        
      });
    }else{
      this.filepathtoupload = this.existingDir;            
    }

    let load ={
      data:{
        dir_fld:this.filepathtoupload,
        issubmitted_fld:  this.submittedFiles.length > 0 || this.files.length > 0?1:0
      },
      notif:{
        id:this._user.getUserID(),
        recipient: this._user.getSelectedClass().empcode_fld,
        message: this._user.getFullname()+' save a work in '+this._user.getSelectedClass().subjdesc_fld,
        module: 'classroom'
      }
      
    }

    this.isLoading = 1
  
    let api = `editsubmit/${this.works[0].submitcode_fld}/${this.works[0].actcode_fld}`

    this._ds._httpRequest(api,load,1).subscribe((data:any)=>{
      this.isLoading = 0
      data = this._user._decrypt(data.a); 
      this.existingDir = data.payload[0].dir_fld;
      this.works = data.payload;            
      this.files = [];
      if (data.payload[0].dir_fld == '') {
        this.submittedFiles = []
      }else{
        this.submittedFiles = this._upload.splitFilestring(data.payload[0].dir_fld);
      }
      this.issubmitted = data.payload[0].issubmitted_fld;
      this.isUploading = false;
    },er => {
      er = this._user._decrypt(er.error.a); 
    })
    
  }

  // end of saving activity




  back() {
    this.route.navigateByUrl('main/classes/'+this._user.getSelectedClass().classcode_fld);
  }
  
 viewQuiz(i){
  let load: any;  
  if(i==0){
    load = {view: 0, load: this.activity};        
  }
  else{
    load = {view: 1, load: this.works[0]};
  }   

  const dialogRef = this.dialog.open(ViewQuizComponent, {
    panelClass: 'quiz',
    maxWidth: '100vw',
    maxHeight: '100vh',
    data: load,
    disableClose: true,
  });
  const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
    dialogRef.updateSize('100vw', '100vh');

    // if (result.matches) {
    //   dialogRef.updateSize('100%', '100%');
    // } else {
    //   dialogRef.updateSize('100%', '100%');
    // }
  });

  dialogRef.afterClosed().subscribe(result => {
    responsiveDialogSubscription.unsubscribe();
    if (result.data) {
      let data = {
        data:{
          classcode_fld:this._user.getSelectedClass().classcode_fld,
          actcode_fld: this.arr[4],
          studnum_fld:this._user.getUserID(),
          type_fld:result.data.type,
          dir_fld:result.data.dir_fld,
          issubmitted_fld: result.data.submitted,
          isscored_fld:result.data.isscored_fld,
          score_fld:result.data.score_fld
        },
        notif:{
          id:this._user.getUserID(),
          recipient: this._user.getSelectedClass().empcode_fld,
          message: this._user.getFullname()+' submitted the quiz ',
          module: 'classroom'
        }

      }
      this._ds._httpRequest('addwork',data,1).subscribe((data:any)=>{
        data = this._user._decrypt(data.a);
        this.works = data.payload;
        
      },er=>{
        er = this._user._decrypt(er.error.a);
      })
    }
  });


 
}


deletecomment(i,commentcode , option){
  let condel
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data = {
    option: option,
    isConfirmed: condel,
    data:commentcode
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
          message: this._user.getFullname()+' created a comment on '+this._user.getSelectedClass().subjdesc_fld,
          module: 'classroom'
        }
      }
      this._ds._httpRequest('editcomm/'+commentcode, load , 1).subscribe((res) => {
        res = this._user._decrypt(res.a);
      }, er => {
        er = this._user._decrypt(er.error.a);   
        this.comments.splice(i,1);
        this.commentcount = this.commentcount - 1;
      })
    }
  });
}

deletereply(i,j,commentcode , option){
  let condel
  const dialogConfig = new MatDialogConfig();
  dialogConfig.minWidth = '30vw',
  dialogConfig.minHeight = '20vh',
  dialogConfig.width = '30vw',
  dialogConfig.data = {
    option: option,
    isConfirmed: condel,
    data:commentcode
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
          message: this._user.getFullname()+' created a comment on '+this._user.getSelectedClass().subjdesc_fld,
          module: 'classroom'
        }
      }
      this._ds._httpRequest('editcomm/'+commentcode, load , 1).subscribe((res) => {
        res = this._user._decrypt(res.a);
      }, er => {
        er = this._user._decrypt(er.error.a);   
        this.comments[i].reply.splice(j,1);
      })
    }
  });
}

reply(authorid_fld,actioncode_fld){
  this.replystatus = 1;
  this.recipientcode = actioncode_fld;
  
}
cancelreply(){
  this.replystatus = 0;
}

addReply(e,item,i){
  e.preventDefault();
  this._user.setLoading(true);
  
  let replycontent = e.target[0].value;
  
  if (replycontent == '' || replycontent == undefined || replycontent == null) {
    this._snackbar.open('Please  write a content for your reply.', null, {duration:1500});
    this._user.setLoading(false);
  }else{
    let load = {
      data:{
        classcode_fld:this._user.getSelectedClass().classcode_fld,
        authorid_fld : this._user.getUserID(),
        actioncode_fld:item.commentcode_fld,
        content_fld : replycontent,
        withfile_fld: 0,
        dir_fld : ''
      },
      notif:{
        id:this._user.getUserID(),
        recipient: this._user.getSelectedClass().empcode_fld,
        message: this._user.getFullname()+' added a reply in'+ this.actTitle,
        module: 'classroom'
      }
      
    }
    
    this._ds._httpRequest('addcomment',load,1).subscribe((data:any)=>{
      data = this._user._decrypt(data.a);
      
      if (this.comments[i].reply == null) {
        this.comments[i].reply = [];
        this.comments[i].reply.push(data.payload[0]);
      } else {
        this.comments[i].reply.push(data.payload[0]);
      }  
      e.target[0].value  = null;
      this.replystatus = 0;
      this._user.setLoading(false);
      // this.editstatus = 0;
      // this.postcomments.unshift(this._user._convert(data.payload[0]));
    },er=>{
      er = this._user._decrypt(er.error.a);
      this._user.setLoading(false);
      // this._snackbar.open(er.message, null, {duration:1500});

      
    })
  }
  
}

editthis(index,reply,i){
  this.commentcode = reply.commentcode_fld;
  this.commentcontent = reply.content_fld;
  this.i = index;  
  (<HTMLInputElement>document.getElementById(i + 'reply_content_fld' + index)).value = this.commentcontent; 
     
  let reditbox = document.getElementById(i + 'redit-box' + index);
  
  reditbox.style.display === "none" ? reditbox.style.display = "flex" : reditbox.style.display = "none";

}

showReply(i){
  var x = document.getElementById('replydiv'+i);
  x.style.display === "none" ? x.style.display = "block" : x.style.display = "none";
  let j = document.getElementById('replybtn' + i);
  j.style.display === "none" ? j.style.display = "block" : j.style.display = "none"; 

}

getFileExtension(filename) {
  if (filename == 'docx') { return '#004db3'; }
  if (filename == 'pptx') { return '#c34524'; }
  if (filename == 'txt') { return '#95a5a6'; }
  if (filename == 'pdf') { return '#ad0b00'; }
  else {
    return '#1f6499';
  }
}
getfileExt(filename) {
  return filename.split('.').pop();
}

editReply(e,i){
  e.preventDefault();
  this._user.setLoading(true);
  let commentcontent = e.target[0].value;
  if (commentcontent == '' || commentcontent == undefined || commentcontent == null) {
    this._snackbar.open('Please  write a content for your comment.', null, {duration:1500});
    this._user.setLoading(false);
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
        message: this._user.getFullname()+' added a comment in'+ this.actTitle,
        module: 'classroom'
      }

    }
    this._ds._httpRequest('editcomm/'+this.commentcode, load , 1).subscribe((res) => {
      res = this._user._decrypt(res.a);
      this.comments[i].reply[this.i] = res.payload[0];
      // this.replyobject[this.i] = res.payload[0];  
      // this.editstatus = 0; 
      this.replystatus = 0;
      this._user.setLoading(false);
    }, er => {
      let err = this._user._decrypt(er.error.a);
    })
  }
  
}

cancelEditReply(i,j){
  let replybox = document.getElementById(i + 'replybox' + j);
  let redit = document.getElementById(i + 'redit-box' + j);
  redit.style.display === "flex" ? redit.style.display = "none" : redit.style.display = "none";
  replybox.style.display = 'flex';  
}

previewResource(link, name) {

  let data = {
    resourceString: link,
    reourcename: name
  }

  const dialogRef = this.dialog.open(ResourcePreviewComponent, {
    panelClass: 'dialogpadding',
    maxWidth: '100vw',
    maxHeight: '100vh',
    disableClose: true,
    data: data
  });

  const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
    if (result.matches) {
      dialogRef.updateSize('100%', '100%');
    } else {
      dialogRef.updateSize('100%', '100%');
    }
  });
  
  dialogRef.afterClosed().subscribe(result => {
    responsiveDialogSubscription.unsubscribe();
  })
}


}
