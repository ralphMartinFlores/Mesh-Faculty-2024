import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
// import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { Observable } from 'rxjs';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
// import { ResourcePreviewComponent } from 'src/app/shared/resource-preview/resource-preview.component';

@Component({
  selector: 'app-view-quiz',
  templateUrl: './view-quiz.component.html',
  styleUrls: ['./view-quiz.component.scss']
})
export class ViewQuizComponent implements OnInit {
  quizpath: any;
  status: number;
  totalquestion: any;
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);

  constructor(
    private breakpointObserver: BreakpointObserver,
    public _snackbar:MatSnackBar,
    public _ds:DataService,public _user:UserService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
     public dialogReg: MatDialogRef<ViewQuizComponent>,
     public dialog: MatDialog) { }

  count:number = 0;
  quizObject = [];
  questionObject;
  answerkeyObject = [];
  isSubmitConfirmed = false

  quizScore = [];
  index = 0;
  submit = 0;
  answerObject = [{
    questionid: '',
    question: '',
    answer: ''
  }];

  question: string;
  questiontype: any;
  choice: string;

  answer: string;
  start:number = 0;

  open: boolean = false;
  newdata = [];
  overall: number = 0;
  quiztotal: number = 0;
  totalscore: number = 0;
  passingscore: number = 0;

  randomQuestion = [];
  ngOnInit(): void {   

    if(this.data.view == 1 ){
      this.getQuizScore(this.data.load['dir_fld']);
      this.start = 2;
    }
    else{

      this.getQuiz(this.data.load[0]['filedir_fld']);
      if (this.data.load[0]['deadline_fld'] < this._user.getDateToday()) {
        this.status = 2;
      }else{
        this.status = 1;
      }
      
      
    }
    
  }

  initializeAnswerObject() {
    for (let i = 0; i < this.questionObject.length - 1; i++) {
      this.answerObject.push({ questionid: '', question: '', answer: '' })
    }
    
  }


  setAnswers(i, answer) {   
    
    let questionItem = this.questionObject[i]

    this.answerObject[i] = {
      questionid: questionItem.questionid,
      question: questionItem,
      answer: answer
    };

  }

  isSubmitButtonDisabled = false;

  async confirmQuiz(){
    this.isSubmitButtonDisabled = true
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    if (this._user.isMobile()) {
      dialogConfig.maxHeight = '40vw';
      dialogConfig.minHeight = 'auto';
      dialogConfig.minWidth = '20vw';
      dialogConfig.maxWidth = '40vw';
    } else {
      dialogConfig.minHeight = '20vh';
      dialogConfig.minWidth = '20vw';
    }
    dialogConfig.data = {
      option: 'quizConfirmation',
      isConfirmed: '',
      data: ''
    }


    const dialogRef = await this.dialog.open(DialogComponent, dialogConfig).afterClosed().subscribe(result=>{
        if(result.data == 1) this.SubmissionQuiz();
        this.isSubmitButtonDisabled  = false
    })

  }


  async SubmissionQuiz() {

    for (let index = 0; index < this.answerObject.length; index++) {
      if(this.answerObject[index] != null && this.answerObject[index].question != ''  ){
      }else{
        let emptyAnswer = {
          question: "Not Answered Yet!",
          questionid: index.toString(),
          answer: "Not Answered Yet!"
        }
        
        this.answerObject.splice(index,1,emptyAnswer);
      }     
    }

    for (let index = 0; index < this.answerObject.length; index++) {
      if(this.answerObject[index].question == "Not Answered Yet!"){
        this._snackbar.open("Please answer all questions.",null,{duration:1500});
        return;
      }
    }
    
    let load = {
        data:{
          filepath:this.data.load[0]['filedir_fld'],
          answer: await this.calculateQuiz()  
        },
        notif:{
          id:this._user.getUserID(),
          recipient: this._user.getSelectedClass().empcode_fld,
          message: this._user.getFullname()+' submitted the quiz ',
          module: 'classroom'
        }
    }

    let requestURL = `addanswer/${this._user.getSettings().acadyear_fld}/${this._user.getSettings().sem_fld}`
    
    this._ds._httpRequest(requestURL, load, 1).subscribe((res: any) => {
      res = this._user._decrypt(res.a);

      this.quizpath = res.payload.filepath;
      this.quizScore = res.payload.result.result;
      this.totalscore = res.payload.result.totalscore;
      this.quiztotal = res.payload.result.quiztotal;
      this.passingscore = this.quiztotal * .6;
      this.start = 2;
      this.dialogReg.close({
        data:{

            dir_fld:this.quizpath,
            submitted:this.status,
            type:1,
            score_fld:this.totalscore,
            isscored_fld:1

        }
      });
       
    }, er => {
      er = this._user._decrypt(er.error.a);
      
    })

  }

  // submitQuiz(){

  // }

  Previewanswer() {
    this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        this.dialogReg.updateSize('100%', '100%');
      } else {
        this.dialogReg.updateSize('100%', '100%');
      }
    });
    if(this.data.load['quizoptions_fld'] == 1){
      this.open = !this.open;
    }
  }

  cancelQuiz() {
    this.dialogReg.close('');
  }

  getQuiz(str) {
    this._ds._httpRequest('getquiz', { filepath: str }, 1).subscribe(  (res: any) => {
      res = this._user._decrypt(res.a);
      this.quizObject =  res.payload.quiz;
      this.answerkeyObject =  res.payload.answerkey.content
      if(this.data.load[0].isquizrandom_fld == 1) {  this.questionObject = this.arrayshuffle(this.quizObject['content']); }
      else { this.questionObject = this.quizObject['content']  }
      
      this.initializeAnswerObject()

    }, er => {

    })
  }

  arrayshuffle(data){
    let newPos:number, temp:number;
    for (let i = data.length - 1; i > 0; i--) {
      newPos = Math.floor(Math.random() * ( i+1 ));
      temp = data[i];
      data[i] = data[newPos];
      data[newPos] = temp;
    }    
    return data;
  }

  getQuizScore(str) {
    this._ds._httpRequest('getresult', { filepath: str }, 1).subscribe((res: any) => {
      res = this._user._decrypt(res.a);
      this.quizScore = res.payload.result;
      this.totalquestion = res.payload.result.length;
      this.totalscore = res.payload.totalscore;
      this.quiztotal = res.payload.quiztotal;
      this.passingscore = this.quiztotal * .6;


       this.start = 2;

    }, er => {

    })
  }


  getAnswers(id) {
    for (let i = 0; i <= this.answerkeyObject.length; i++) {
      if (id == this.answerkeyObject[i].questionid) {
        return this.answerkeyObject[i].answer;
      }
    }
  }

  startQuiz() {
    this.start = 1;

  }

  splitChoices(string) {
    return string.split('//*//');
  }

 calculateQuiz(){
    let answer =  this.answerObject
    let answerkey =  this.answerkeyObject
    let totalScore = 0
    let totalQuizScore = 0

    answer.forEach((element, i) => {
      let key = answerkey.find((item: any ) => { return element.questionid == item.questionid });
      answer[i]['points'] = 0
      answer[i]['mark'] = 0
      totalQuizScore += key.score
      let studAnswer = element.answer.trim()
      let quizAnswer = key.answer.trim()
      if(studAnswer.toUpperCase() == quizAnswer.toUpperCase()){
        answer[i]['points'] = key.score
        answer[i]['mark'] = 1
        totalScore += key.score
      }    
  })
  let answerJson = {
    totalscore: totalScore,
    quiztotal: totalQuizScore,
    result: answer
  }
  return answerJson
}


checkIfQuestionIsString(question, isImage){
  if(typeof question === 'string' && isImage === 0) return question
  if(typeof question !== 'object' && isImage === 1) return null
  return isImage == 1 ? question[1] : question[0]
}


viewimg(i){
  // const dialogConfig = new MatDialogConfig();
  //   dialogConfig.autoFocus = true;
  //   if (this._user.isMobile()) {
  //     dialogConfig.minHeight = 'auto';
  //     dialogConfig.minWidth = '90vw';
  //     dialogConfig.width = '90vw';
  //   } else {
  //     dialogConfig.minHeight = '83vh';
  //     dialogConfig.minWidth = '70vw';
  //     dialogConfig.width = '70vw';
  //   }
  //   dialogConfig.data = {
  //     height: '90vh',
  //     width: '70vw',
  //     resourceString: i
  //   }
  //   const dialogRef = this.dialog.open(ResourcePreviewComponent, dialogConfig)
  //   dialogRef.afterClosed().subscribe(result => {
  //   })
  //   const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
  //     if (result.matches) {
  //       dialogRef.updateSize('1000px', '490px');
  //     } else {
  //       dialogRef.updateSize('1000px', '490px');
  //     }
  //   });
}

}
