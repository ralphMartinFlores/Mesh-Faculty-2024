import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ViewDataOnlyComponent } from 'src/app/shared/components/view-data-only/view-data-only.component';
import { CrudCommentsComponent } from 'src/app/shared/components/crud-comments/crud-comments.component';
import { pluscard } from 'src/app/shared/animation/animation';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { NavigationExtras, Router } from '@angular/router';
import { UploadingService } from 'src/app/services/uploading.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CrudPostComponent } from 'src/app/shared/components/crud-post/crud-post.component';
import { DeleteRecordComponent } from 'src/app/shared/components/delete-record/delete-record.component';
import { CrudResourcesComponent } from 'src/app/shared/components/crud-resources/crud-resources.component';
import { CrudActivityComponent } from 'src/app/shared/components/crud-activity/crud-activity.component';
import { getRecipients } from 'src/app/services/data.schema';
import { CommonService } from 'src/app/services/common.service';
import { ViewpollComponent } from 'src/app/shared/components/viewpoll/viewpoll/viewpoll.component';

@Component({
  selector: 'app-classfeed',
  templateUrl: './classfeed.component.html',
  styleUrls: ['./classfeed.component.scss'],
  animations: [
    pluscard
  ]
})
export class ClassfeedComponent implements OnInit {

  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  topicObj: any = [];
  getRecipients = new getRecipients();
  pollToggle: boolean = false;
  pollOptions: any = [];
  postobject: any = [];
  videoobj = [];
  activities: any = [];
  resourcesObj: any = [];
  filePreviewAndUpload: any = [];
  postcontent: string = '';
  acceptedFiles = ".doc,.docx,.html,.htm,.odt,.pdf,.xls,.xlsx,.ods,.ppt,.pptx,.txt";
  filetype: number = 0;
  loadingclassfeed: boolean;
  loadmaterials: boolean;
  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public _ds: DataService,
    public _user: UserService,
    private _router: Router,
    public _uploadservice: UploadingService,
    private sanitizer: DomSanitizer,
    private _commonservice: CommonService) {
  }

  ngOnInit(): void {
    this.initializeComponents();
  }

  createQuiz() {
    this._user.setQuiz(null);
    this._router.navigate(['/main/quiz']);
  }

  resetFunction() {
    this.filePreviewAndUpload = [];
    this.postcontent = '';
    this.filetype = 0;
  }

  addOption(e) {
    e.preventDefault();
    let f = e.target.elements;
    this.pollOptions.push(f.option_name.value);
    f.option_name.value = null;
  }

  removePollOption(i) {
    this.pollOptions.splice(i, 1);
  }

  initializeComponents() {
    this.getClassPost();
    this.getClassResources();
    this.getActivities();
    this.getClassTopics();
    this._uploadservice.files = [];
  }

  getFile(event: any, type: number) {
    this.filePreviewAndUpload = this._uploadservice.getFilePreview(event);
    if (this.filePreviewAndUpload.length > 0) {
      this.filetype = type;
    }
  }

  removeFilePreviews(i) {
    this.filePreviewAndUpload.splice(i, 1);
    if (this.filePreviewAndUpload.length == 0) {
      this.filetype = 0;
    }
  }


  editpoll(item, state, i) {
    let recipients = this.getRecipients.memberMap(this._user.getClassMembers().student);
    let load = {
      data: {
        "withfile_fld": state,
      }, notif: {
        id: this._user.getUserID(),
        recipient: recipients.join(':'),
        message: this._user.getUserFullname() + (state == 3 ? ' Opened ' : ' Closed ') + "Poll in " + this._user.getClassroomInfo().subjdesc_fld,
        module: 'Classroom',
      }
    };
    this._ds._httpRequest('editpost/' + item.postcode_fld + '/' + 'post', load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.addfiles(dt.payload)
        .then(data => { this.postobject[i] = data[0] });
      this._user.openSnackBar((state == 3 ? ' Opened Poll Successfully' : ' Closed Poll Successfully'), null, 2000);
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }

  togglePoll() { this.pollToggle = !this.pollToggle; }

  async getClassPost() {
    let load = {
      data: {
        classcode: this._user.getClassroomInfo().classcode_fld,
        type: 'post',
      }
    }
    await this._ds._httpRequest('getcpost', load, 1).subscribe(async (dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.addfiles(dt.payload).then(data => this.postobject = data);
    }, er => {
      er = this._user._decrypt(er.error.a);
      this.postobject = [];
    })
  }

  async addfiles(array) {
    array.forEach(e => {
      e.images_fld = [];
      e.video_fld = [];
      e.attachment_fld = [];
      e.pollchoices_fld = [];
      e.embedvideo_fld = [];
      e.pollresponse_fld = [];
      e.authorid_fld == this._user.getUserID() ? e.author_owner = true : e.author_owner = false;

      if (e.dir_fld) {
        let files = this._uploadservice.splitFilestring(e.dir_fld);
        files.map(f => {
          if (f.path.includes('gif') || f.path.includes('jpeg') || f.path.includes('jpg') || f.path.includes('png') || f.path.includes('bmp')) {
            e.images_fld.push(f);
          }
          if (f.path.includes('mp4') || f.path.includes('m4v') || f.path.includes('avi') || f.path.includes('mpg') || f.path.includes('wmv')) {
            e.video_fld.push(f);
          }
          if (f.path.includes('sql') || f.path.includes('doc') || f.path.includes('docx') || f.path.includes('html') || f.path.includes('htm') || f.path.includes('pdf') || f.path.includes('xls') || f.path.includes('xlsx') || f.path.includes('ods') || f.path.includes('csv') || f.path.includes('ppt') || f.path.includes('pptx') || f.path.includes('txt')) {
            e.attachment_fld.push(f);
          }
        });
      }
      if (e.content_fld.includes('youtube.com') || e.content_fld.includes('google.com/file/d/')) {
        e.embedvideo_fld = this.getVideoEmbedURL(e.content_fld);
      }
      if ((e.withfile_fld == 3 || e.withfile_fld == 4)) {
        let pollObj = this._uploadservice.splitPollContent(e);
        e.content_fld = pollObj.content_fld;
        e.pollchoices_fld = pollObj.pollchoices_fld;
        let load = {
          data: {
            postcode: e.postcode_fld,
            filepath: {
              options: []
            }
          }
        }
        e.pollchoices_fld.map((chc) => {
          load.data.filepath.options.push({ "choice": chc, "votes": 0, "respondents": [] });
        })
        this._commonservice.commonSubscribe('getpoll', load, 1)
          .then(async (dt: any) => {
            e.pollresponse_fld = await dt.payload.options;
            e.pollresponse_fld = await this.displayVotee( e.pollresponse_fld)
            
          })
      }
    });
    return new Promise((resolve) => resolve(array));
  }


  getActivities() {
    this.loadmaterials = true;
    this._ds._httpRequest('getcpost', { data: { classcode: this._user.getClassroomInfo().classcode_fld, type: "" } }, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.activities = dt.payload;
      this.loadmaterials = false;
    }, er => {
      er = this._user._decrypt(er.error.a);
      this.activities = [];
      this.loadmaterials = false;
    })
  }

  getClassResources() {
    this.loadmaterials = true;
    let load = {
      data: { classcode: this._user.getClassroomInfo().classcode_fld, }
    }
    this._ds._httpRequest('getreslist', load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.resourcesObj = dt.payload;
      this.loadmaterials = false;
    }, er => {
      er = this._user._decrypt(er.error.a);
      this.loadmaterials = false;
      this.resourcesObj = [];
    })
  }

  // Add post in Class feed:
  async onSubmit(e) {
    this.loadingclassfeed = true;
    e.preventDefault();
    let recipients = this.getRecipients.memberMap(this._user.getClassMembers().student);

    if (this.pollToggle) {
      let load = {
        data: {
          content_fld: this.postcontent + '($)' + this.pollOptions.join('(*)'),
          authorid_fld: this._user.getUserID(),
          classcode_fld: this._user.getClassroomInfo().classcode_fld,
          withfile_fld: 3,
        }, notif: {
          id: this._user.getUserID(),
          recipient: recipients.join(':'),
          message: this._user.getUserFullname() + " Added Poll in " + this._user.getClassroomInfo().subjdesc_fld,
          module: 'Classroom',
        }
      }
      this._commonservice.commonSubscribe('addpost', load, 1)
        .then(async (data: any) => {
          this.addfiles(data.payload).then(dt => this.postobject.unshift(dt[0]))
          this.loadingclassfeed = false;
          this.pollToggle = !this.pollToggle;
          this.pollOptions = [];
          this.resetFunction();
          this._user.openSnackBar('Post has been added.', null, 2000);
        },er=>{
         
        });
    } else {
      this._uploadservice.uploadFiles(this.filePreviewAndUpload).then((files => {
        let load = {
          data: {
            content_fld: this.postcontent,
            authorid_fld: this._user.getUserID(),
            classcode_fld: this._user.getClassroomInfo().classcode_fld,
            withfile_fld: this.filetype,
            dir_fld: files || null,
          }, notif: {
            id: this._user.getUserID(),
            recipient: recipients.join(':'),
            message: this._user.getUserFullname() + " Added Post in " + this._user.getClassroomInfo().subjdesc_fld,
            module: 'Classroom',
          }
        }
        this._commonservice.commonSubscribe('addpost', load, 1)
          .then(async (data: any) => {
            this.addfiles(data.payload).then(dt => this.postobject.unshift(dt[0]))
            this.resetFunction();
            this.loadingclassfeed = false;
            this._user.openSnackBar('Post has been added.', null, 2000);
          },er=>{
          });
      }));

    }
  }

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
        this.postobject.splice(i, 1);
      }
    });
  }

  deleteAct(type, item, i) {
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
        this.activities.splice(i, 1);
      }
    });
  }


  deleteRes(type, item, i) {
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
        this.resourcesObj.splice(i, 1);
      }
    });
  }


  editResources(item, i) {
    let data = {
      "type": 'edit_resources',
      "data": item,
      "topicdata": this.topicObj,
    };
    const dialogRef = this.dialog.open(CrudResourcesComponent, {
      // panelClass: 'custom-modalbox',
      maxWidth: '100vw',
      // maxHeight: '100%',
      data: data,
      disableClose: true,
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('90%', 'auto');
      } else {
        dialogRef.updateSize('40%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
      if (result != undefined) {
        this.resourcesObj[i] = result;
      }
    });
  }

  getClassTopics() {
    let load = {
      data: { classcode: this._user.getClassroomInfo().classcode_fld, }
    };
    this._ds._httpRequest('gettopic', load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.topicObj = dt.payload;
      this._user.setTopic(dt.payload);
    }, er => {
      er = this._user._decrypt(er.error.a);
      this.topicObj = [];
    });
  }

  editActivity(item, i) {
    let data = {
      "type": 'edit_act',
      "data": item,
      "topicdata": this.topicObj,
    };
    const dialogRef = this.dialog.open(CrudActivityComponent, {
      panelClass: 'Assignment-modalbox',
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
        this.activities[i] = result;
      }
    });
  }


  Commentdialog(postcode, i) {
    let data = {
      "type": 'post-commments',
      "postcode": postcode,
    };
    const dialogRef = this.dialog.open(CrudCommentsComponent, {
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
      this.postobject[i].commentcount = result
    });
  }

  ViewResource(item) {
    let data = {
      "type": 'Resources',
      data: item,
    };
    const dialogRef = this.dialog.open(ViewDataOnlyComponent, {
      panelClass: '',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: data
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('98%', 'auto');
      } else {
        dialogRef.updateSize('45%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();

    });
  }

  editPost(item, i) {
    let data = {
      "type": 'edit_post',
      data: item,
    };
    const dialogRef = this.dialog.open(CrudPostComponent, {
      panelClass: '',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: data,
      disableClose: true,
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('98%', 'auto');
      } else {
        dialogRef.updateSize('45%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      responsiveDialogSubscription.unsubscribe();
      if (result == undefined) return
      result = await this.addfiles(result);
      result = await this.addVideoUrl(result);
      this.postobject[i] = result[0];
    });
  }

  viewActivity(item) {
    window.sessionStorage.removeItem(btoa('activityinfo'));
    this._user.setActivityInfo(item);
  }


  deletePost(data, i) {
    let load = {
      isdeleted_fld: 1
    }
    // Bugs Here NO RETURN DATA
    this._ds._httpRequest('editpost/' + data.postcode_fld + '/' + null, load, 1).subscribe((res) => {
      res = this._user._decrypt(res.a);
      this.getClassPost();
    }, err => {
      err = this._user._decrypt(err.error.a);
      this.getClassPost();

    });
  }


  addVideoUrl(array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].content_fld.includes('youtube.com') || array[i].content_fld.includes('google.com/file/d/')) {
        array[i].videolink_fld = this.getVideoEmbedURL(array[i].content_fld);
      }
      else {
        array[i].videolink_fld = null;
      }
    }
    return array;
  }

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

  editQuiz(item, i) {
    item.istoedit_fld = 1;
    this._user.setQuiz(item);
    this._router.navigate(['main/quiz']);
  }

  createAssignmentDialog() {
    let data = {
      "type": 'assignment',
      "topicdata": this.topicObj,
    };
    const dialogRef = this.dialog.open(CrudActivityComponent, {
      panelClass: 'Assignment-modalbox',
      maxWidth: '100vw',
      maxHeight: '100vh',
      disableClose: true,
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
        this.activities.unshift(result[0]);
      }
    });
  }

  createResourcesDialog() {
    let data = {
      "type": 'resources',
      "topicdata": this.topicObj,
    };
    const dialogRef = this.dialog.open(CrudResourcesComponent, {
      // panelClass: 'custom-modalbox',
      maxWidth: '100vw',
      maxHeight: '100%',
      disableClose: true,
      data: data
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('90%', 'auto');
      } else {
        dialogRef.updateSize('50%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
      if (result != undefined) {
        this.resourcesObj.unshift(result);
      }
    });
  }

  viewPoll(pollresponse){
   
    const dialogRef = this.dialog.open(ViewpollComponent, {
      // panelClass: 'custom-modalbox',
      maxWidth: '100vw',
      maxHeight: '100%',
      disableClose: false,
      data: pollresponse
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('98%', 'auto');
      } else {
        dialogRef.updateSize('50%', 'auto');
      }
    });

  }

  displayVotee(respondents){
   
    for (let i = 0; i < respondents.length; i++) {
      let respondee: string[] = []
      for (let j = 0; j < respondents[i].votes; j++) {
        respondee.push(respondents[i].respondents[j].fullname)
      }
      respondents[i].tooltip = respondee.join(', ')
    }
    return respondents
  }



}
