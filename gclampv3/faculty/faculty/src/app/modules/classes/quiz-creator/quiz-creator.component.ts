import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CRUDClassAndActivitiesComponent } from 'src/app/shared/components/crud-class-and-activities/crud-class-and-activities.component';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { MatOption } from '@angular/material/core';
import { DataService } from 'src/app/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';
import { userInfo } from 'os';
@Component({
  selector: 'app-quiz-creator',
  templateUrl: './quiz-creator.component.html',
  styleUrls: ['./quiz-creator.component.scss']
})
export class QuizCreatorComponent implements OnInit, OnDestroy {

  @ViewChild('allSelected') private allSelected: MatOption;
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  QuizBasicDetails: FormGroup;
  studentObject: any = [];
  topicObject: any = [];
  quizContent: any = [];
  answerkey: any = [];
  quizTotalScore: number = 0;
  timer: number;
  minDate = new Date();
  dueDateMin: any;
  dataEdit: any = [];
  minDateTime: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    public _user: UserService,
    private _ds: DataService,
    private router: Router,
    private ar: ActivatedRoute,
    private datepipe: DatePipe,
    private _common: CommonService,
  ) { }

  ngOnInit(): void {
    this.intializeFunctions();
  }

  ngOnDestroy(): void {
    window.sessionStorage.removeItem(btoa('quiz'));
  }

  intializeFunctions() {

    this.getClassList();
    this.getClassTopic();
    this.QuizBasicDetails = this.fb.group({
      quiz_title: ['', Validators.required],
      quiz_instruction: [''],
      student_selected: ['', Validators.required],
      selected_topic: ['', Validators.required],
      quiz_duedate: [{ disabled: true, value: '', }, Validators.required],
      quiz_duetime: [{ disabled: true, value: '', }, Validators.required],
      quiz_scheduledate: ['', Validators.required],
      quiz_scheduletime: ['', Validators.required],
    });




    if (this._user.getQuiz() != null) this.quizToEdit();
    if (this._user.getQuiz() == null) this.checkDraft();
  }



  quizToEdit() {

    this.dataEdit = this._user.getQuiz();

    let datetime: any = this.datepipe.transform(new Date(this.dataEdit.deadline_fld), 'yyyy-MM-dd;HH:mm');
    datetime = datetime.split(';');

    let scheddatetime: any = this.datepipe.transform(new Date(this.dataEdit.datesched_fld), 'yyyy-MM-dd;HH:mm');
    scheddatetime = scheddatetime.split(';');

    this.dueDateMin = this.datepipe.transform(new Date().setDate(new Date(scheddatetime[0]).getDate()), 'yyyy-MM-dd');


    this.QuizBasicDetails = this.fb.group({
      quiz_title: [this.dataEdit.title_fld, Validators.required],
      quiz_instruction: [this.dataEdit.desc_fld],
      student_selected: ['', Validators.required],
      selected_topic: [this.dataEdit.topiccode_fld, Validators.required],
      quiz_duedate: [datetime[0], Validators.required],
      quiz_duetime: [datetime[1], Validators.required],
      quiz_scheduledate: [scheddatetime[0], Validators.required],
      quiz_scheduletime: [scheddatetime[1], Validators.required],
    });

    this.QuizBasicDetails.controls.student_selected.patchValue([...this.dataEdit.recipient_fld.split('.')].map((item: any) => item));
    this._common.commonSubscribe('getquiz', { filepath: this.dataEdit.filedir_fld }, 1)
      .then((dt: any) => {
        this.quizContent = dt.payload.quiz.content;
        this.answerkey = dt.payload.answerkey.content;
        this.quizTotalScore = dt.payload.quiz.total;
      });

  }

  deleteQuestion(i) {
    this.quizTotalScore -= this.answerkey[i].score;
    this.quizContent.splice(i, 1);
    this.answerkey.splice(i, 1);
    this.saveDraft();
  }

  scheduleDateOnChange(e: any) {
    if (this.QuizBasicDetails.controls.quiz_scheduledate.valid) {
      this.dueDateMin = this.datepipe.transform(new Date().setDate(new Date(e.value).getDate()), 'yyyy-MM-dd');
      this.QuizBasicDetails.controls.quiz_duedate.enable();
      this.QuizBasicDetails.controls.quiz_duetime.enable();
    }
  }

  tosslePerOne() {
    if (this.allSelected.selected) { this.allSelected.deselect(); return false };
    if (this.QuizBasicDetails.controls.student_selected.value.length == this.studentObject.length)
      this.allSelected.select();
  }


  toggleAllSelection() {
    if (this.allSelected.selected)
      this.QuizBasicDetails.controls.student_selected.patchValue([...this.studentObject.map((item: any) => item.studnum_fld), '0']);
    if (!this.allSelected.selected)
      this.QuizBasicDetails.controls.student_selected.patchValue([]);
  }

  getErrorMessage() {
    if (this.QuizBasicDetails.controls.quiz_title.hasError('required')) { return 'Title is required' }
  }

  getSelectStudentErrorMessage() {
    if (this.QuizBasicDetails.controls.student_selected.hasError('required')) { return 'Select Student is required' }
  }

  getDueDateErrorMessage() {
    if (this.QuizBasicDetails.controls.quiz_duedate.invalid) return 'Due date is INVALID';
  }

  getDueDateTimeErrorMessage() {
    if (this.QuizBasicDetails.controls.quiz_duetime.hasError('required')) { return 'Due Time is required' }
  }

  getScheduleDateErrorMessage() {
    if (this.QuizBasicDetails.controls.quiz_scheduledate.hasError('required')) { return 'Quiz schedule is required' }
  }

  getScheduleTimeErrorMessage() {
    if (this.QuizBasicDetails.controls.quiz_scheduletime.hasError('required')) { return 'Time schedule is required' }
  }

  newQuestion(type, i) {
    let item: any;

    item = {
      index: i,
      questions: this.quizContent[i],
      answer: this.answerkey[i]
    }

    let data = {
      questionid: type == 0 ? this.quizContent.length + 1 : item.questions.questionid,
      data: type == 0 ? item = null : item,
      type: type,
      action: 'Create'
    };

    const dialogRef = this.dialog.open(CRUDClassAndActivitiesComponent, {
      panelClass: 'custom-modalbox',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: data
    });

    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('98%', 'auto');
      } else {
        dialogRef.updateSize('40%', 'auto');
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
      if (result != undefined) {
        this.quizTotalScore = 0;

        // For Editing Question
        if (result.type == 1) {
          this.quizContent[result.index] = result.question[0];
          this.answerkey[result.index] = result.answer[0];
        }

        // For Adding Question
        if (result.type == 0) {
          this.quizContent.push(result.question[0]);
          this.answerkey.push(result.answer[0]);
        }
        this.answerkey.forEach(element => this.quizTotalScore += element.score);
        this.saveDraft();
      }

    });
  }



  checkDraft() {
    this._user.setLoading(true);
    let filepath = 'uploads/faculty/' + this._user.getUserID() + '/temp/' + this._user.getClassroomInfo().classcode_fld + '.json';
    this._common.commonSubscribe('getquiz', { filepath: filepath }, 1)
      .then((dt: any) => {



        let datetime: any = this.datepipe.transform(new Date(dt.payload.quiz.deadline_fld), 'yyyy-MM-dd;HH:mm');
        datetime = datetime.split(';');

        let scheddatetime: any = this.datepipe.transform(new Date(dt.payload.quiz.datesched_fld), 'yyyy-MM-dd;HH:mm');
        scheddatetime = scheddatetime.split(';');


        this.QuizBasicDetails = this.fb.group({
          quiz_title: [dt.payload.quiz.quiztitle, Validators.required],
          quiz_instruction: [dt.payload.quiz.instruction],
          student_selected: ['', Validators.required],
          selected_topic: [dt.payload.quiz.topiccode_fld, Validators.required],
          quiz_duedate: [datetime[0], Validators.required],
          quiz_duetime: [datetime[1], Validators.required],
          quiz_scheduledate: [scheddatetime[0], Validators.required],
          quiz_scheduletime: [scheddatetime[1], Validators.required],
        });

        this.QuizBasicDetails.controls.student_selected.patchValue([...dt.payload.quiz.recipient_fld.split('.')].map((item: any) => item));

        this.quizContent = dt.payload.quiz.content;
        this.answerkey = dt.payload.answerkey.content;
        this.quizTotalScore = dt.payload.quiz.total;


        this._user.setLoading(false);
      }).catch(err => err);
  }


  saveDraft() {
    this._user.setLoading(true);
    let load = {
      data: {
        classcode: this._user.getClassroomInfo().classcode_fld,
        quiz: {
          "quiztitle": this.QuizBasicDetails.controls.quiz_title.value,
          "instruction": this.QuizBasicDetails.controls.quiz_instruction.value,
          "recipient_fld": (this.QuizBasicDetails.value.student_selected).join('.'),
          "topiccode_fld": this.QuizBasicDetails.value.selected_topic,
          "totalscore_fld": this.quizTotalScore,
          "deadline_fld": `${this.datepipe.transform(new Date(this.QuizBasicDetails.value.quiz_duedate), 'yyyy-MM-dd')} ${this.QuizBasicDetails.value.quiz_duetime}`,
          "datesched_fld": `${this.datepipe.transform(new Date(this.QuizBasicDetails.value.quiz_scheduledate), 'yyyy-MM-dd')} ${this.QuizBasicDetails.value.quiz_scheduletime}`,
          "total": this.quizTotalScore,
          "timer": this.timer,
          "content": this.quizContent
        },
        answerkey: {
          content: this.answerkey
        }
      },
      notif: null
    }
    this._common.commonSubscribe('draftquiz', load, 1)
      .then((dt: any) => {
        this._user.setLoading(false);
        this._user.openSnackBar('Quiz quizzes were successfully saved in drafts. 📝', null, 1500);
      }).catch(err => err);
  }

  saveQuiz() {

    if (this.QuizBasicDetails.invalid) return;
    this._user.setLoading(true);
    let load = {
      classcode: this._user.getClassroomInfo().classcode_fld,
      data: {
        quiz: {
          quiztitle: this.QuizBasicDetails.value.quiz_title,
          instruction: this.QuizBasicDetails.value.quiz_instruction,
          total: this.quizTotalScore,
          timer: this.timer,
          content: this.quizContent
        }, answerkey: {
          content: this.answerkey
        }, notif: null
      }
    }

    this._common.commonSubscribe('addquiz', load, 1)
      .then((dt: any) => {
        let load = {
          data: {
            "authorid_fld": this._user.getUserID(),
            "type_fld": 1,
            "recipient_fld": (this.QuizBasicDetails.value.student_selected).join('.'),
            "topiccode_fld": this.QuizBasicDetails.value.selected_topic,
            "title_fld": this.QuizBasicDetails.value.quiz_title,
            "desc_fld": this.QuizBasicDetails.value.quiz_instruction,
            "totalscore_fld": this.quizTotalScore,
            "filedir_fld": dt.payload.filepath,
            "classcode_fld": this._user.getClassroomInfo().classcode_fld,
            "deadline_fld": `${this.datepipe.transform(new Date(this.QuizBasicDetails.value.quiz_duedate), 'yyyy-MM-dd')} ${this.QuizBasicDetails.value.quiz_duetime}`,
            "datesched_fld": `${this.datepipe.transform(new Date(this.QuizBasicDetails.value.quiz_scheduledate), 'yyyy-MM-dd')} ${this.QuizBasicDetails.value.quiz_scheduletime}`,
            "withfile_fld": 2
          }, notif: null
        }
        this._common.commonSubscribe('addactivity', load, 1).then(() => {
          this._user.openSnackBar('The quiz was successfully created.', null, 3000);
          this.router.navigate(['main/classes/' + this._user.getClassroomInfo().classcode_fld]);
        })
      }).catch(() => {
        this._user.setLoading(false);
      });
  }

  saveEditQuiz() {
    if (this.QuizBasicDetails.invalid) return;
    this._user.setLoading(true);
    let load = {
      filepath: this.dataEdit.filedir_fld,
      classcode: this._user.getClassroomInfo().classcode_fld,
      data: {
        quiz: {
          quiztitle: this.QuizBasicDetails.controls.quiz_title.value,
          instruction: this.QuizBasicDetails.controls.quiz_instruction.value,
          total: this.quizTotalScore,
          timer: this.timer,
          content: this.quizContent
        }, answerkey: {
          content: this.answerkey
        },
      }
    }
    this._common.commonSubscribe('editquiz', load, 1)
      .then(async (dt: any) => {
        let load = {
          data: {
            "authorid_fld": this._user.getUserID(),
            "type_fld": 1,
            "recipient_fld": (this.QuizBasicDetails.value.student_selected).join('.'),
            "topiccode_fld": this.QuizBasicDetails.value.selected_topic,
            "title_fld": this.QuizBasicDetails.value.quiz_title,
            "desc_fld": this.QuizBasicDetails.value.quiz_instruction,
            "totalscore_fld": this.quizTotalScore,
            "filedir_fld": await dt.payload.filepath,
            "classcode_fld": this._user.getClassroomInfo().classcode_fld,
            "deadline_fld": `${this.datepipe.transform(new Date(this.QuizBasicDetails.value.quiz_duedate), 'yyyy-MM-dd')} ${this.QuizBasicDetails.value.quiz_duetime}`,
            "datesched_fld": `${this.datepipe.transform(new Date(this.QuizBasicDetails.value.quiz_scheduledate), 'yyyy-MM-dd')} ${this.QuizBasicDetails.value.quiz_scheduletime}`,
          },
          notif: null
        }
        this._common.commonSubscribe('editpost/' + this.dataEdit.actcode_fld + '/' + 'act', load, 1)
          .then(() => {
            this.resetForms();
            this._user.openSnackBar('The quiz was successfully saved.', null, 3000);
            this.router.navigate(['main/classes/' + this._user.getClassroomInfo().classcode_fld]);
          });
      }).catch((error) => error);
  }

  resetForms() {
    this.QuizBasicDetails.reset();
    this.quizContent = [];
    this.answerkey = [];
    this.quizTotalScore = 0;
  }

  getClassList() {
    let load = {
      data: {
        classcode: this._user.getClassroomInfo().classcode_fld,
        acadyear: this._user.getSettings().acadyear_fld,
        semester: this._user.getSettings().sem_fld
      }
    }
    this._common.commonSubscribe('getmembers', load, 1)
      .then((dt: any) => {
        this.studentObject = dt.payload.student;
      })
      .catch(err => err);
  }

  getClassTopic() {
    let load = { data: { classcode: this._user.getClassroomInfo().classcode_fld, } }
    this._common.commonSubscribe('gettopic', load, 1)
      .then((dt: any) => {
        this.topicObject = dt.payload;
      })
      .catch(err => err);
  }

  loadQuiz(event){
    
    const fileToLoad = event.target.files[0]
    const fileReader = new FileReader()
    fileReader.onload = async (fileLoadEvent)=>{
      const textFromFileLoaded: any = fileLoadEvent.target.result
      const json = JSON.parse(textFromFileLoaded)
      this.quizContent = await json.quiz.content
      this.answerkey = await json.answerkey.content  
      this.quizTotalScore = await json.quiz.total
    }
    try{
      fileReader.readAsText(fileToLoad, "UTF-8");
    }
    catch(e){
      this._user.openSnackBar('Failed to import quiz', null, 1500);
    }
  }
}
