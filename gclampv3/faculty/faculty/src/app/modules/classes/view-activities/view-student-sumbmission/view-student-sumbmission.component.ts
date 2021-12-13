import { UploadingService } from 'src/app/services/uploading.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ViewDataOnlyComponent } from 'src/app/shared/components/view-data-only/view-data-only.component';
import { BreakpointState, Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-view-student-sumbmission',
  templateUrl: './view-student-sumbmission.component.html',
  styleUrls: ['./view-student-sumbmission.component.scss']
})
export class ViewStudentSumbmissionComponent implements OnInit, OnDestroy {

  linkPath: any;
  link: any;
  isImg = 0
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  SaveGradesForm: FormGroup;
  submission: any = [];
  quiz: any = [];
  answerkey: any = [];
  studanswer: any = [];
  displayedColumns = ['number', 'question', 'type', 'answerkey', 'studentanswer', 'mark', 'score', 'action'];
  dataSource: any;
  downloadResources: any;


  constructor(
    public _user: UserService,
    public _uploadservice: UploadingService,
    public sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private fb: FormBuilder,
    public _ds: DataService,
  ) { }

  ngOnInit(): void {
    this.getQuizResult();
    this.submission.push(this._user.getViewSubmission());
    if (this.submission[0].dir_fld !== null) {
      this.submission[0].dir_fld = this._uploadservice.splitFilestring(this.submission[0].dir_fld);
      this.microsoftViewer(this.submission[0].dir_fld[0]);
      this.link = this.submission[0].dir_fld[0].link;
    
    }
    this.SaveGradesForm = this.fb.group({
      grades: [this.submission[0].score_fld, Validators.required],
    });
  }

  ngOnDestroy() {
    window.sessionStorage.removeItem(btoa('submission'));
  }

  microsoftViewer(link) {
    this.link = link
    let embbed: string;
    let name: string = this._uploadservice.getfileExt(link.name);

    

    if (name.includes('pptx') || name.includes('xlsx')  || name.includes('docx')  || name.includes('doc') || name.includes('csv')) {
      embbed = `https://view.officeapps.live.com/op/embed.aspx?src=${link.link}&embedded=true`;
      this.isImg = 0
      this._user.setLoading(false);
    }

     if ( name.includes('txt') || name.includes('pdf') || name.includes('java') || name.includes('py') ) {
      // embbed = `http://docs.google.com/gview?url=${link.link}&pid=explorer&efh=false&a=v&chrome=false&embedded=true`;
      embbed = link.link
      this.isImg = 0

      this._user.setLoading(false);
    }
    if (name.includes('jpg') || name.includes('png') 
    || name.includes('jpeg')  || name.includes('gif')  
    || name.includes('svg')  || name.includes('tiff')
    || name.includes('bmp') || name.includes('raw')
    || name.includes('webp')) {
      // embbed = `http://docs.google.com/gview?url=${link.link}&pid=explorer&efh=false&a=v&chrome=false&embedded=true`;
      embbed = link.link
      this.isImg = 1
      this._user.setLoading(false);
    }

    if (embbed != undefined) {
      this.linkPath = this.sanitizer.bypassSecurityTrustResourceUrl(embbed);
      this._user.setLoading(false);
    } else {
      this.linkPath = null;
      this.downloadResources = {
        link: link.path,
        name: link.name
      };
      this._user.setLoading(false);

    }
    this._user.setLoading(false);
  }

  getErrorMessage() {
    if (this.SaveGradesForm.controls.grades.hasError('required')) return 'You must enter a value';
  }

  editGrade() {
    this.submission[0].isscored_fld = 0;
  }

  saveGrade() {
    if (this.SaveGradesForm.invalid) return;
    this._user.setLoading(true);
    let load = {
      data: {
        score_fld: this.SaveGradesForm.value.grades,
        isscored_fld: 1
      }, notif: null,
    }
    let api = `editsubmit/${this.submission[0].submitcode_fld}/${this.submission[0].studnum_fld}/${this.submission[0].actcode_fld}`

    this._ds._httpRequest(api, load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this._user.setLoading(false);
      this.submission[0].score_fld = load.data.score_fld;
      this.submission[0].isscored_fld = load.data.isscored_fld;
      this.submission[0].dir_fld = this._user.getViewSubmission()['dir_fld'];
      this._user.setViewSubmission(this.submission[0]);
      this.submission[0] = this._user.getViewSubmission();
      if (this.submission[0].dir_fld !== null) {
        this.submission[0].dir_fld = this._uploadservice.splitFilestring(this.submission[0].dir_fld);
      }
      this._user.openSnackBar('Grades were successfully saved.', null, 3000);
    }, err => {
      err = this._user._decrypt(err.error.a);
      this._user.setLoading(false);
    });
  }

  selectionView() {
    let data = {
      "type": 'selection',
    };
    const dialogRef = this.dialog.open(ViewDataOnlyComponent, {
      // panelClass: '',
      // maxWidth: '100vw',
      // maxHeight: '100vh',
      data: data,
      disableClose: true,
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      // if (result.matches) {
      //   dialogRef.updateSize('98%', 'auto');
      // } else {
      //   dialogRef.updateSize('45%', 'auto');
      // }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
    });
  }

  changeMarkStatus(i: number) {
    this.dataSource._renderData._value[i].mark = !this.dataSource._renderData._value[i].mark;
    this.studanswer.map((data: any) => {
      if (this.dataSource._renderData._value[i].questionid == data.questionid) {
        this.dataSource._renderData._value[i].mark == true ? data.mark = parseInt('1') : data.mark = parseInt('0');
        this.dataSource._renderData._value[i].mark == true ? data.points = parseInt(this.dataSource._renderData._value[i].score) : data.points = parseInt('0');
        this.dataSource._renderData._value[i].mark == true ? this.dataSource._renderData._value[i].points = parseInt(this.dataSource._renderData._value[i].score) : this.dataSource._renderData._value[i].points = parseInt('0');
        this.dataSource._renderData._value[i].mark == true ? this.dataSource._renderData._value[i].mark = parseInt('1') : this.dataSource._renderData._value[i].mark = parseInt('0');
      }
    });
    this.getNewScoreValue();
  }

  inputEssayScore(i: number) {
    let data = {
      "type": 'score_essay',
      "data": this.dataSource._renderData._value[i],
    };
    const dialogRef = this.dialog.open(ViewDataOnlyComponent, {
      width: '100%',
      height: '100%',
      disableClose: true,
      data: data
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('100vw', 'auto');
      } else {
        dialogRef.updateSize('100vw', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      responsiveDialogSubscription.unsubscribe();
      if (result == undefined) return;
      this.dataSource._renderData._value[i].points = result;
      this.studanswer.map((data: any) => {
        if (this.dataSource._renderData._value[i].questionid == data.questionid) {
          result > 0 ? data.mark = parseInt('1') : data.mark = parseInt('0');
          result > 0 ? this.dataSource._renderData._value[i].mark = parseInt('1') : this.dataSource._renderData._value[i].mark = parseInt('0');
          data.points = parseInt(result);
        }
      });
      this.getNewScoreValue();
    });
  }

  getQuizResult() {
    if (this._user.getViewSubmission()['type_fld'] == 0) return;
    this._ds._httpRequest('getquizresult', { filepath: this._user.getViewSubmission()['dir_fld'], quizpath: this._user.getActivityInfo().filedir_fld }, 1).subscribe((res: any) => {
      res = this._user._decrypt(res.a)
      this.quiz = res.payload.quiz.content;
      this.answerkey = res.payload.key.content;
      this.studanswer = res.payload.studentanswer;
      this.quizSegragation();
    }, er => {
      er = this._user._decrypt(er.error.a)
    });

  }

  quizSegragation() {
    let initial_array = [];
    let final_array = [];

    this.quiz.map((q) => {
      this.answerkey.map((a) => {
        if (q.questionid === a.questionid) {
          let m1 = { ...q, ...a }
          initial_array.push(m1);
        }
      });
    });

    initial_array.map((k) => {
      this.studanswer.map((sa) => {
        if (k.questionid === sa.questionid) {
          k.answerkey = k.answer;
          let m2 = { ...k, ...sa }
          final_array.push(m2)
        }
      })
    });
    this.dataSource = new MatTableDataSource(final_array);
  }


  splitChoice(data) {
    return data.split('//*//');
  }

  getNewScoreValue() {
    const arr = [];
    this.studanswer.map(data => {
      arr.push(parseInt(data.points));
    });
    const reducer = (accumulator, curr) => accumulator + curr;
    this.submission[0].score_fld = arr.reduce(reducer);
    this.saveQuizStundentResponse();
  }


  saveQuizStundentResponse() {
    this._user.setLoading(true);
    let load = {
      filepath: this.submission[0].dir_fld[0].name,
      answer: {
        result: this.dataSource.data,
        totalscore: this.submission[0].score_fld,
        quiztotal: this._user.getActivityInfo().totalscore_fld,
      }
    }

    this._ds._httpRequest('editanswer', load, 1).subscribe(async (res: any) => {
      res = await this._user._decrypt(res.a);
      let load = {
        data: {
          score_fld: this.submission[0].score_fld,
        }, notif: null
      }
    let api = `editsubmit/${this.submission[0].submitcode_fld}/${this.submission[0].studnum_fld}/${this.submission[0].actcode_fld}`

      this._ds._httpRequest(api, load, 1).subscribe((dt: any) => {
        this._user.setLoading(false);

        dt = this._user._decrypt(dt.a);
        this.submission[0].score_fld = dt.payload[0].score_fld;
        this.submission[0].dir_fld = this._user.getViewSubmission()['dir_fld'];
        this._user.setViewSubmission(this.submission[0]);
        this.submission[0] = this._user.getViewSubmission();
        if (this.submission[0].dir_fld !== null) {
          this.submission[0].dir_fld = this._uploadservice.splitFilestring(this.submission[0].dir_fld);
        }
        this._user.openSnackBar('Grades were successfully saved.', null, 3000);
      }, err => {
        err = this._user._decrypt(err.error.a);
        this._user.setLoading(false);

      });
    }, er => {
      er = this._user._decrypt(er.error.a);
      this._user.setLoading(false);

    });
  }



}
