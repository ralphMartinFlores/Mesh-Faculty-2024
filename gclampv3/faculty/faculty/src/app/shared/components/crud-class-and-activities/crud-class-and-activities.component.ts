import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-crud-class-and-activities',
  templateUrl: './crud-class-and-activities.component.html',
  styleUrls: ['./crud-class-and-activities.component.scss']
})
export class CRUDClassAndActivitiesComponent implements OnInit {

  selecteQuizType: number = 0;
  questioniaresForms: FormGroup;
  choicesObject: any = [];
  selectedAnswer: any;
  quizContent: any = [];
  quizAnwerKey: any = [];

  constructor(
    public _ds: DataService,
    public _user: UserService,
    private dialogReg: MatDialogRef<CRUDClassAndActivitiesComponent>, @Inject(MAT_DIALOG_DATA)
    public data: any,
    private dialog: MatDialog, private fb: FormBuilder,
    private datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.intializeFunctions();
  }

  intializeFunctions() {
    this.questioniaresForms = this.fb.group({
      question_points: [1, Validators.required],
      question_description: ['', Validators.required],
      question_answerkey: ['', Validators.required],
      question_choice: [[]],
    });

    if (this.data.type) {
      this.selecteQuizType = this.data.data.questions.questiontype
      this.editQuestion();
    }
  }



  editQuestion() {
    this.questioniaresForms = this.fb.group({
      question_points: [this.data.data.answer.score, Validators.required],
      question_description: [this.data.data.questions.question, Validators.required],
      question_answerkey: [this.data.data.answer.answer, Validators.required],
      question_choice: [],
    });
    // data.type == 1 ? data.data.answer.answer : item
    this.choicesObject = this.data.data.questions.choices.split('//*//');
    this.questioniaresForms.controls.question_answerkey.setValue(this.data.data.answer.answer);

    // if (this.data.type) {
    //   this.selecteQuizType = this.data.data.questions.questiontype;
    //   this.questioniaresForms.controls.question_choice.setValue()

    //   console.log(this.questioniaresForms);


    //   if (this.data.data.questions.questiontype = 0) {



    //   } else {

    //   }



    // } else {

    // }
  }

  addChoices() {
    if (this.choicesObject.length > 4) return this._user.openSnackBar('The maximum number of choices has been reached.', 'Close', 3000);
    this.choicesObject.push(this.questioniaresForms.value.question_choice);
    this.questioniaresForms.controls.question_choice.reset()

    if (this.hasDuplicates(this.choicesObject)) {
      this.choicesObject.splice(-1, 1);
      this._user.openSnackBar('Invalid! duplicate choices.', 'Close', 3000);
    }
  }

  removeChoices(i) {
    this.choicesObject.splice(i, 1);
    this._user.openSnackBar('Choice removed.', 'Close', 3000);
  }

  hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
  }

  addQuizQuestion() {
    this.questioniaresForms.controls.question_choice.setValue(this.choicesObject.join('//*//'));

    this.quizContent.push({
      questionid: this.data.questionid,
      questiontype: this.selecteQuizType,
      choices: this.questioniaresForms.value.question_choice,
      question: this.questioniaresForms.value.question_description
    });
    this.quizAnwerKey.push({
      questionid: this.data.questionid,
      answer: this.questioniaresForms.value.question_answerkey,
      score: this.questioniaresForms.value.question_points,
    });

    this.questioniaresForms.reset({ question_points: 1 });
    this.choicesObject = [];

    let load = {
      question: this.quizContent,
      answer: this.quizAnwerKey,
      type: this.data.type,
      index: null
    }

    if (this.data.type == 1) load.index = this.data.data.index;
    if (this.selecteQuizType == 3) this.questioniaresForms.controls.question_answerkey.setValue('');

    this.dialogReg.close(load);
  }
}
