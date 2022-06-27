import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PostCommentsComponent } from './post-comments/post-comments.component';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { PostsEditComponent } from 'src/app/shared/posts-edit/posts-edit.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResourcePreviewComponent } from 'src/app/shared/resource-preview/resource-preview.component';
import { UploadsService } from 'src/app/services/uploads.service';
import { CommonService } from 'src/app/services/common.service';
import { ChangePassModalComponent } from '../../profile/change-pass-modal/change-pass-modal.component';
import { QuestService } from 'src/app/services/quest.service';
import { Crud, fldNames } from 'src/app/services/enum';


@Component({
  selector: 'app-class-feed',
  templateUrl: './class-feed.component.html',
  styleUrls: ['./class-feed.component.scss']
})
export class ClassFeedComponent implements OnInit {

  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  classobject: any;
  globalvar: any;
  subjcode: any;
  postobject: any = [];
  pageslice: any = [];
  resources: any[] = [];
  teacherlistobject: any;
  instructor: any;
  students: any;
  activities: any[] = [];
  files: any = [];
  fileButton: boolean = false;
  photoButton: boolean = false;
  videoButton: boolean = false;
  openButton: number = 0;
  withfile: number;
  isUploading: boolean;
  filepathtoupload: any;
  textcontent: string = '';
  datatoedit: any;
  filepath: FormData;
  act: any[] = [];
  acceptedFiles = ".doc,.docx,.html,.htm,.odt,.pdf,.xls,.xlsx,.ods,.ppt,.pptx,.txt";
  commentcount: number;
  activityObject: any = [];
  pinnedCount = 0

  constructor(public _user: UserService,
    public _ds: DataService,
    public uploadservice: UploadsService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private sanitizer: DomSanitizer,
    private _snackbar: MatSnackBar,
    public _upload: UploadsService,
    public _commonservice: CommonService,
    public _quest:QuestService
    ) { }

  ngOnInit(): void {
    this.getClasspost();
    this.getActivities();
    this.getResoure();
  }
  ngAfterViewInit(): void{
    console.clear()
  }


  getFileExtension(filename) {
    if(filename == 'pdf'){
      return '#EA462E';
    }else if(filename == 'docx'){
      return '#2D5292';
    }
    else if(filename == 'ppt'){
      return '#CA4223';
    }
    else if(filename == 'zip'){
      return '#B23333';
    }
    else if(filename == 'txt'){
      return '#546A7A';
    }else{
      return '#222';
    }
  }

getfileExt(filename) {
    return filename.split('.').pop();
  }

getClasspost() {
    this._ds._httpRequest('getcpost', { classcode: this._user.getSelectedClass().classcode_fld, type: "post" }, 1).subscribe((data: any) => {
      data = this._user._decrypt(data.a);
      this.postobject = data.payload;
      if (this.postobject != null) {
        this.postobject.sort((a, b) => {
          return <any>new Date(b.timestamp_fld) - <any>new Date(a.timestamp_fld);
        })
        this.pageslice = this.addVideoUrl(this.postobject);
        this.pageslice = this.addfiles(this.postobject);
      }
    }, er => {
      er = this._user._decrypt(er.error.a);
      this.postobject = [];
    })
  }

  getActivities() {
    let load = {
      classcode: this._user.getSelectedClass().classcode_fld,
      type: ""
    }
    this._ds._httpRequest('getcpost', load, 1).subscribe((data: any) => {
      data = this._user._decrypt(data.a);
      this.activities = data.payload;
      for (let i = 0; i < this.activities.length; i++) {
        if (this.activities[i].type_fld === 0 || this.activities[i].type_fld === 1 && this.activities[i].datesched_fld < this._user.getDateToday()) {
          this.activities[i].openQuiz = true;
        }else{
          this.activities[i].openQuiz = false;

        }
        
      }
      
      
    }, er => {
      er = this._user._decrypt(er.error.a);
    })
  }



getResoure() {
    this._ds._httpRequest('getreslist', { classcode: this._user.getSelectedClass().classcode_fld }, 1).subscribe((data: any) => {
      data = this._user._decrypt(data.a);
      this.resources = data.payload;
      this._user.setResources(data.payload);
    }, er => {
      er = this._user._decrypt(er.error.a);
    })
  }
  // Fetching Data End

  // Start of file uploading
  async submitPost() {
    this._user.setLoading(true);
      this.fileButton = true;
      this.photoButton = true;
      this.videoButton = true;
      await this._upload.Filepath(this.files).then((filepath: any) => {
        this.filepathtoupload = filepath;
      }).catch(e => {
        return;
      });


      let load = {
        data: {
          classcode_fld: this._user.getSelectedClass().classcode_fld,
          authorid_fld: this._user.getUserID(),
          content_fld: this.textcontent,
          withfile_fld: this.withfile,
          dir_fld: this.filepathtoupload
        },
        notif: {
          id: this._user.getUserID(),
          recipient: this._user.getSelectedClass().empcode_fld,
          message: this._user.getFullname() + ' created a post on ' + this._user.getSelectedClass().subjdesc_fld,
          module: 'classroom'
        }


      }

      this._ds._httpRequest('addpost', load, 1).subscribe((data: any) => {
        data = this._user._decrypt(data.a);
        this.postobject.splice(this.pinnedCount, 0, data.payload[0]);
        this.pageslice = this.addVideoUrl(this.postobject);
        this.pageslice = this.addfiles(this.postobject);

        this.textcontent = '';
        this.files = [];
        this.filepathtoupload = '';
        this.withfile = 0;
        this.fileButton = false;
        this.photoButton = false;
        this.videoButton = false;
        this._user.setLoading(false);
        this._snackbar.open('Post added.', null, { duration: 1500 });
      }, er => {
        er = this._user._decrypt(er.error.a);
        this._user.setLoading(false);
        this._snackbar.open(er.status.message, null, { duration: 1500 });
      });
    // if (this.textcontent == undefined || this.textcontent == '' || this.textcontent == null) {
    //   this._snackbar.open('Please  write a content for your post', "", { duration: 1500 });
    // } else {
      
    // }

  }

async getFile(event) {

    let sum: number = 0;
    for (let i = 0; i < event.target.files.length; i++) {
      sum += event.target.files[i].size;
      this.files.push(event.target.files[i]);
      let ext = this.getext(this.files[i].name);
      switch (ext) {
        case 'txt':
        case 'doc':
        case 'docx':
        case 'html':
        case 'htm':
        case 'odt':
        case 'pdf':
        case 'xls':
        case 'xlsx':
        case 'ods':
        case 'pdf':
        case 'ppt':
        case 'pptx':
          this.fileButton = false;
          this.photoButton = true;
          this.videoButton = true;
          this.withfile = 5;
          break;
        case 'm4v':
        case 'avi':
        case 'mpg':
        case 'mp4':
          this.fileButton = true;
          this.photoButton = true;
          this.videoButton = false;
          this.withfile = 2;
          break;
        case 'jpg':
        case 'gif':
        case 'bmp':
        case 'png':
        case 'jpeg':
          this.fileButton = true;
          this.photoButton = false;
          this.videoButton = true;
          this.withfile = 1;
          break;
      }
      this._upload.getFile(this.files);

    }
    if (sum > 30000000) {
      this._snackbar.open('Your total upload file(S) is ' + ((sum / 1048576).toFixed(2).toString()) + 'MB. Please upload only atleast 30mb of file(s)', "", { duration: 1500 });
      this.fileButton = false;
      this.photoButton = false;
      this.videoButton = false;
      this.files = [];
      (<HTMLInputElement>document.getElementById('files')).value = '';
    } else {
      (<HTMLInputElement>document.getElementById('files')).value = '';
    }
  }

async removeFile(i) {
    this.files.splice(i, 1);
    if (this.files.length == 0) {
      this.fileButton = false;
      this.photoButton = false;
      this.videoButton = false;
      this.filepathtoupload = '';
      this.withfile = 0;
    } else {
      await this._upload.Filepath(this.files).then((filepath: any) => {
        this.filepathtoupload = filepath;
      });
    }
  }

  // End of file uploading

  // Delete Posts
delpost(i, postcode, option) {
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
      option: option,
      isConfirmed: condel,
      data: postcode
    }

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        if(this.pageslice[i].ispinned_fld > 0) { this.pinnedCount -= 1 }
        this.pageslice.splice(i, 1);
        let load = {
          data: {
            classcode_fld: this._user.getSelectedClass().classcode_fld,
            authorid_fld: this._user.getUserID(),
            isdeleted_fld: 1
          },
          notif: {
            id: this._user.getUserID(),
            recipient: this._user.getSelectedClass().empcode_fld,
            message: this._user.getFullname() + ' deleted a post in ' + this._user.getSelectedClass().classcode_fld,
            module: 'classroom'
          }

        }
        this._ds._httpRequest('editpost/' + postcode, load, 1).subscribe((res) => {
          res = this._user._decrypt(res.a);

        }, er => {
          let err = this._user._decrypt(er.error.a);
        })
      }
    });
  }

  // Edit Posts
editPost(index, postcode, load, option) {
    let conedit
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    if (this._user.isMobile()) {
      dialogConfig.maxHeight = '90vw';
      dialogConfig.minHeight = 'auto';
      dialogConfig.minWidth = '70vw';
      dialogConfig.maxWidth = '90vw';
    } else {
      dialogConfig.minHeight = '20vh';
      dialogConfig.minWidth = '25vw';
      dialogConfig.maxHeight = 'auto';
    }
    dialogConfig.data = {
      option: option,
      isConfirmed: conedit,
      data: load
    }
    const dialogRef = this.dialog.open(PostsEditComponent, dialogConfig);
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {

      if (result.data) {
        let load = result.data;
        this._ds._httpRequest('editpost/' + postcode, load, 1).subscribe((res) => {
          res = this._user._decrypt(res.a);
          if (res.status.remarks == 'success') {
            this.postobject[index] = res.payload[0];
            this.postobject.sort((a, b) => {
              return <any>new Date(b.timestamp_fld) - <any>new Date(a.timestamp_fld);
            })
            this.pageslice = this.addVideoUrl(this.postobject);
            this.pageslice = this.addfiles(this.postobject);
            this._snackbar.open('Edited successfully.', null, { duration: 1500 });
          }
          else {
            this.pageslice = null;
          }
        }, er => {
          let err = this._user._decrypt(er.error.a);
          if (err.payload == null) {
            this.getClasspost();
          }

        })
      }
    });
  }


setAnswers(post, j, i) {
    let load = {
      data: {
        postcode_fld: post.postcode_fld,
        studnum_fld: this._user.getUserID(),
        response_fld: j,
        respcode_fld: post.respcode_fld
      },
      filepath: {
        options: post.pollresponse_fld
      },
      notif: {
        id: this._user.getUserID(),
        recipient: this._user.getSelectedClass().empcode_fld,
        message: this._user.getFullname() + ' reponded in a poll on ' + this._user.getSelectedClass().subjdesc_fld,
        module: 'classroom'
      }
    }

  

    this._ds._httpRequest('answerpoll', load, 1).subscribe((data: any) => {
      data = this._user._decrypt(data.a);
      // console.log(data)

      // this.getClasspost()      

      this.postobject[i].pollresponse_fld.map( (poll: any) => {
        poll.userpollvoted = false;
        poll.respondents.map( (e, indx) =>{
              if (e.studnum_fld === this._user.getUserID()) {
                poll.respondents.splice(indx, 1)
                poll.votes -= 1
              }
            })          
      })

      this.postobject[i].pollresponse_fld[j].userpollvoted = true
      this.postobject[i].pollresponse_fld[j].votes += 1
      this.postobject[i].pollresponse_fld[j].respondents.push({
        fullname: this._user.getFullname(),
        profilepic_fld: this._user.getProfilePic(),
        studnum_fld: this._user.getUserID()
      })
         // // this.postobject[i].pollresponse_fld = post.poll_fl   // // console.log(this.postobject[i].pollresponse_fld)     
    }, er => {
      er = this._user._decrypt(er.error.a);
      // console.log(er)
    })
  }

   addfiles(array) {
    array.forEach(async e => {
      if(e.ispinned_fld > 0) { this.pinnedCount += 1 }
      e.images_fld = [];
      e.uploadvideo_fld = [];
      e.attachment_fld = [];
      e.poll_fld = [];
      e.pollchoices_fld = [];
      e.pollresponse_fld = [];
      e.respcode_fld = '';
      e.authorid_fld == this._user.getUserID() ? e.author_owner = true : e.author_owner = false;
      if (e.dir_fld) {
        let files = this._upload.splitFilestring(e.dir_fld);
        files.forEach(f => {
          if (f.path.includes('gif') || f.path.includes('jpeg') || f.path.includes('jpg') || f.path.includes('png') || f.path.includes('bmp')) {
            e.images_fld.push(f);
          }
          if (f.path.includes('mp4') || f.path.includes('m4v') || f.path.includes('avi') || f.path.includes('mpg') || f.path.includes('wmv')) {
            e.uploadvideo_fld.push(f);
          }
          if (f.path.includes('doc') || f.path.includes('docx') || f.path.includes('html') || f.path.includes('htm') || f.path.includes('pdf') || f.path.includes('xls') || f.path.includes('xlsx') || f.path.includes('ods') || f.path.includes('csv') || f.path.includes('ppt') || f.path.includes('pptx') || f.path.includes('txt')) {
            e.attachment_fld.push(f);
          }
        });
      }

      if (e.content_fld.includes('youtube.com') || e.content_fld.includes('google.com/file/d/')) {
        e.embedvideo_fld = this.getVideoEmbedURL(e.content_fld);
      }

    

      if ((e.withfile_fld == 3 || e.withfile_fld == 4)) {
          
       
          let pollObj = await this._upload.splitPollContent(e);
          //  e.content_fld = pollObj.content_fld;
           e.pollchoices_fld = pollObj.pollchoices_fld;
        
        let load = {
          postcode: e.postcode_fld,
          filepath: {
            options: []
          }
        }
        e.pollchoices_fld.map((chc) => {
          load.filepath.options.push({ "choice": chc, "votes": 0, "respondents": [] });
        });
        

        this._commonservice.commonSubscribe('getpoll', load, 1)
          .then(async (dt: any) => {
            e.pollresponse_fld = await dt.payload.options
            e.respcode_fld = dt.payload.respcode;
            e.pollresponse_fld.map(poll => {
              poll.respondents.map(e => {
                if (e.studnum_fld === this._user.getUserID()) {
                  poll.userpollvoted = true;
                }
              })
            })
          });
      }
    });
    return array;
  }

  getFilename(name) {
    return name.replace(/^.*[\\\/]/, '');
  }
  // getFileExtension(filename) {    return filename.split('.').pop();  }
  getfileExtension(filename) {
    let regex = new RegExp('[^.]+$');
    // return filename.match(regex);
    if (filename.match(regex) == 'docx') { return '#004db3'; }
    if (filename.match(regex) == 'ppt') { return '#c34524'; }
    if (filename.match(regex) == 'txt') { return '#95a5a6'; }
    if (filename.match(regex) == 'pdf') { return '#ad0b00'; }
    else {
      return '#1f6499';
    }
  }
  getext(data) {
    return data.split('.').pop();
  }

  addVideoUrl(array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].content_fld.includes('youtube.com') || array[i].content_fld.includes('google.com/file/d/')) {
        array[i].video_fld = this.getVideoEmbedURL(array[i].content_fld);
      }
      else {
        array[i].video_fld = null;
      }
    }
    return array;
  }

    // Start of opening the dialog for preview docx,xlsx,pptx

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
  
    // End of opening the dialog for preview docx,xlsx,pptx

  // Addedd by Melner
  getVideoEmbedURL(content: string): any {

    let replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    let replacedText = content.replace(replacePattern1, '<*>$1<*>');
    let content_arr: string[] = replacedText.split('<*>');

    let a: any = content_arr.filter((x) => {
      if (x.includes('http')) {
        return x
      };
    });

    for (let i = 0; i < a.length; i++) {
      if (a[i].includes('youtube.com')) {
        a[i] = a[i].replace('watch?v=', 'embed/');;
      }
      else {
        a[i] = a[i].replace('view?usp=sharing', 'preview');
      }
      a[i] = this.sanitizer.bypassSecurityTrustResourceUrl(a[i]);
    }
    return a;
  }

  openComments(acode, ccnt, i) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    if (this._user.isMobile()) {
      dialogConfig.minHeight = 'auto';
      dialogConfig.maxHeight = '90vh';
      dialogConfig.minWidth = '90vw';
    } else {
      dialogConfig.minHeight = 'auto';
      dialogConfig.maxWidth = '40vw';
      dialogConfig.maxHeight = '80vh';
    }
    dialogConfig.data = {
      type: 'post-comments',
      acode: acode,
      commentcnt: ccnt
    }
    const dialogRef = this.dialog.open(PostCommentsComponent, dialogConfig);
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('98%', 'auto');
      } else {
        dialogRef.updateSize('50%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.pageslice[i].commentcount = result;
      
      responsiveDialogSubscription.unsubscribe();

    });
  }

}
