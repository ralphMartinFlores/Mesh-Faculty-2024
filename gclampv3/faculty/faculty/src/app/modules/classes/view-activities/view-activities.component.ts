import { Component, OnInit, AfterViewInit } from '@angular/core'
import { DataService } from 'src/app/services/data.service'
import { UploadingService } from 'src/app/services/uploading.service'
import { UserService } from 'src/app/services/user.service'
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { getRecipients } from 'src/app/services/data.schema';
import { DeleteRecordComponent } from 'src/app/shared/components/delete-record/delete-record.component';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-view-activities',
  templateUrl: './view-activities.component.html',
  styleUrls: ['./view-activities.component.scss']
})
export class ViewActivitiesComponent implements OnInit {

  constructor(
    public _user: UserService,
    public _ds: DataService,
    public uploadservice: UploadingService,
    private _router: Router,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
  ) { }
  isOpen = this._user.getActivityInfo().withfile_fld == 3 ? true : false;
  isDisplayResult = this._user.getActivityInfo().quizoptions_fld == 1 ? true : false;
  comments: string = ''
  commentObject = [];
  displayedColumns: string[] = ['studnum_fld', 'lname_fld', 'submittedfiles', 'datetime_fld', 'score_fld', 'action'];
  dataSource: any
  classList: any = [];
  getRecipients = new getRecipients();
  studworks = []
  TabIndex = 0
  quizObject: any = []

  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);

  quizdisplayedColumns = ['number', 'question', 'type', 'answerkey', 'score'];
  quizdataSource: any
  ;
  
  @ViewChild(MatSort) sort: MatSort;  
  @ViewChild(MatPaginator) paginator: MatPaginator; 
 
  ngOnInit(): void {
    this.getActComments()
    this.getStudentWorks();
    this.getClassList();

    if (this._user.getActivityInfo().type_fld == 1)
      this.showQuiz();

  }

 

  setTabIndex(e){
    localStorage.setItem('index', e.index)
  }

  getIndex(){
    this.TabIndex = +localStorage.getItem('index')
  }

  getFileExtension(filename) {
    if (filename == 'pdf') {
      return '#EA462E';
    } else if (filename == 'docx') {
      return '#2D5292';
    }
    else if (filename == 'ppt') {
      return '#CA4223';
    }
    else if (filename == 'zip') {
      return '#B23333';
    }
    else if (filename == 'txt') {
      return '#546A7A';
    } else {
      return '#222';
    }
  }

  async getClassList() {
    let load = {
      data: {
        classcode: this._user.getClassroomInfo().classcode_fld,
        acadyear: this._user.getSettings().acadyear_fld,
        semester: this._user.getSettings().sem_fld
      }
    }
    return new Promise((resolve, rejects) => {
      this._ds._httpRequest('getmembers', load, 1).subscribe((dt: any) => {
        dt = this._user._decrypt(dt.a);
        resolve(dt.payload.student);
      }, er => {
        er = this._user._decrypt(er.error.a);
        return new Promise(() => {
          rejects(er);
        })
      });
    })
  }


  getActComments() {
    this._ds._httpRequest('getccomment', { data: { acode: this._user.getActivityInfo().actcode_fld } }, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a)
      this.commentObject = dt.payload
    }, er => {
      er = this._user._decrypt(er.error.a)
    })
  }


  addComments() {
    if (this.comments == '') return;
    this._user.setLoading(true);
    let load = {
      data: {
        content_fld: this.comments,
        authorid_fld: this._user.getUserID(),
        classcode_fld: this._user.getClassroomInfo().classcode_fld,
        actioncode_fld: this._user.getActivityInfo().actcode_fld,
      }, notif: {
        id: this._user.getUserID(),
        recipient: this._user.getUserID(),
        message: this._user.getUserFullname() + " Added Comment Activity in " + this._user.getClassroomInfo().subjdesc_fld,
        module: 'Classroom',
      }
    }

    this._ds._httpRequest('addcomment', load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a)
      this.comments = ''
      this.commentObject.unshift(dt.payload[0]);
      this._user.setLoading(false);
    }, er => {
      er = this._user._decrypt(er.error.a)
      this._user.setLoading(false);
    })
  }


  async getStudentWorks() {
    this._user.setLoading(true);
    let load = {
      data: {
        classcode: this._user.getClassroomInfo().classcode_fld,
        actcode: this._user.getActivityInfo().actcode_fld,
        type: null,
        acadyear: this._user.getSettings().acadyear_fld,
        semester: this._user.getSettings().sem_fld
      }
    }
    this._ds._httpRequest('getstudworks', load, 1).subscribe(async (dt: any) => {
      dt = this._user._decrypt(dt.a)
      this.studworks = dt.payload
      this.dataSource = await new MatTableDataSource(this.studworks);
      
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator;
      this._user.setLoading(false);
      this.getIndex()
    }, async er => {
      er = this._user._decrypt(er.error.a);
      this.dataSource = er.payload;
      this._user.setLoading(false);
    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewSubmission(data) {
    if (data.issubmitted_fld == 1 || data.issubmitted_fld == 2) {
      window.sessionStorage.removeItem(btoa('submission'));
      this._user.setViewSubmission(data);
      this._router.navigate([`main/classes/${data.classcode_fld}/${data.actcode_fld}/${data.studnum_fld}`]);
    }
  }

  editGrade(i) {
    this.dataSource._renderData._value[i].isscored_fld = !this.dataSource._renderData._value[i].isscored_fld;
  }

  saveGrade(i) {
    let load = {
      data: {
        score_fld: this.dataSource._renderData._value[i].score_fld,
        isscored_fld: 1
      }, notif: null
    }
    let api = `editsubmit/${this.dataSource._renderData._value[i].submitcode_fld}/${this.dataSource._renderData._value[i].studnum_fld}/${this.dataSource._renderData._value[i].actcode_fld}`
    this._ds._httpRequest(api, load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.dataSource._renderData._value[i].isscored_fld = !this.dataSource._renderData._value[i].isscored_fld;
    }, err => {
      err = this._user._decrypt(err.error.a);
    });
  }

 
  editActivity(state) {
    let load = {
      data: { withfile_fld: state },
      notif: null
    }
    this._ds._httpRequest('editpost/' + this._user.getActivityInfo().actcode_fld + '/' + 'act', load, 1).subscribe((res) => {
      res = this._user._decrypt(res.a);
      this._user.setActivityInfo(res.payload[0]);
      this._user.openSnackBar(state == 2 ? 'The quiz is now over.' : 'The quiz is about to begin.', 'Okay', 5000);
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }



  showQuiz() {
    this._ds._httpRequest('getquiz', { filepath: this._user.getActivityInfo().filedir_fld }, 1).subscribe(async (res: any) => {
      res = this._user._decrypt(res.a)
      let answerkey = await res.payload.answerkey.content;
      let quizcontent = await res.payload.quiz.content;
      this.quizObject = await res.payload;
      let initial_array = [];

      quizcontent.map((q) => {
        answerkey.map((a) => {
          if (q.questionid === a.questionid) {
            let m1 = { ...q, ...a }
            initial_array.push(m1);
          }
        });
      });
      this.quizdataSource = new MatTableDataSource(initial_array);
    }, err => {

    })
  }



  onSaveSettings() {
    let load = {
      data: {
        withfile_fld: this.isOpen ? '3' : '2',
        quizoptions_fld: this.isDisplayResult ? '1' : 0
      },
      notif: null
    }
    this._ds._httpRequest('editpost/' + this._user.getActivityInfo().actcode_fld + '/' + 'act', load, 1).subscribe((res) => {
      res = this._user._decrypt(res.a);
      this._user.setActivityInfo(res.payload[0]);
      this._user.openSnackBar('The quiz settings were successfully saved.', null, 2000);
    }, er => {
      er = this._user._decrypt(er.error.a);
    });

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
        this.commentObject.splice(i, 1);
      }
    });
  }

  sortData(sort: any){
    const data = this.dataSource.data
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'lname_fld': return compare(a.lname_fld, b.lname_fld, isAsc);
        case 'studnum_fld': return compare(a.studnum_fld, b.studnum_fld, isAsc);
        case 'datetime_fld': return compare(a.datetime_fld, b.datetime_fld, isAsc);
        // case 'carbs': return compare(a.carbs, b.carbs, isAsc);
        // case 'protein': return compare(a.protein, b.protein, isAsc);
        default: return 0;
      }
    });

    function compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
    
  }



  splitChoice(data) {
    return data.split('//*//');
  }

  downloadQuiz(){
    const blob = new Blob([JSON.stringify(this.quizObject)], {type: 'text/json'})
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${this._user.getActivityInfo().title_fld}.json`;
    a.click();
  }

 
  deleteSubmit(item , i){
   
    let load = {
      data: {
        isdeleted_fld: 1
      },
      notif: null
    }
    let api = `editsubmit/${item.submitcode_fld}/${item.studnum_fld}/${item.actcode_fld}`
    this._ds._httpRequest(api, load, 1).subscribe( async (res: any)=>{
       res = this._user._decrypt(res.a)
       await this.studworks.splice(i, 1)
       this.dataSource = await new MatTableDataSource(this.studworks)
       
       
    },er=>{
      er = this._user._decrypt(er.error.a)
    })

  }



}



