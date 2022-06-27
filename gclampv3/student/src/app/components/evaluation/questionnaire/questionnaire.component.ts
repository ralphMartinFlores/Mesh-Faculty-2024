import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit {
  class: any = [];
  questions = new Questions();
  frmResponse: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = "center";
  verticalPosition: MatSnackBarVerticalPosition = "bottom";
  snackbarConfig: any = {
    duration: 1000,
    verticalPosition: this.verticalPosition,
    horizontalPosition: this.horizontalPosition
  }


  constructor(
    public _user: UserService,
    private _ds: DataService,
    private _router: Router,
    public _formBuilder: FormBuilder,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.setValidators();
    this.getFaculty();
  }

  getFaculty(): void {
    this.class = this._user.getSelectedClass();
  }

   
  submitResponse(e): void {
    e.preventDefault();
    let varControls = this.frmResponse.controls;

    let classinfo = {
      studnum_fld: this.class.studnum_fld,
      classcode_fld: this.class.classcode_fld,
    }

    let request: any = {
      studnum_fld: this.class.studnum_fld,
      classcode_fld: this.class.classcode_fld,
      empcode_fld: this.class.empcode_fld,
      p11_fld: varControls.p11_fld.value,
      p12_fld: varControls.p12_fld.value,
      p13_fld: varControls.p13_fld.value,
      p14_fld: varControls.p14_fld.value,
      p15_fld: varControls.p15_fld.value,

      p21_fld: varControls.p21_fld.value,
      p22_fld: varControls.p22_fld.value,
      p23_fld: varControls.p23_fld.value,
      p24_fld: varControls.p24_fld.value,

      p31_fld: varControls.p31_fld.value,
      p32_fld: varControls.p32_fld.value,
      p33_fld: varControls.p33_fld.value,

      p41_fld: varControls.p41_fld.value,
      p42_fld: varControls.p42_fld.value,
      p43_fld: varControls.p43_fld.value,
      p44_fld: varControls.p44_fld.value,
      p45_fld: varControls.p45_fld.value,

      p51_fld: varControls.p51_fld.value,
      p52_fld: varControls.p52_fld.value,
      p53_fld: varControls.p53_fld.value,
      p54_fld: varControls.p54_fld.value,
      p55_fld: varControls.p55_fld.value,

      p61_fld: varControls.p61_fld.value,
      p62_fld: varControls.p62_fld.value,
      p63_fld: varControls.p63_fld.value,
      p64_fld: varControls.p64_fld.value,
      p65_fld: varControls.p65_fld.value,

      weak_fld: varControls.weak_fld.value,
      strong_fld: varControls.strong_fld.value,
      acadyear_fld: this._user.getSettings().acadyear_fld,
      term_fld: this._user.getSettings().activeterm_fld
    }

    let termvalues: any;
    if(this._user.getSettings().activeterm_fld==1){
      termvalues = { mgrade_fld: 1, fgrade_fld: 0 }
    } else {
      termvalues = { mgrade_fld: this.class.mgrade_fld, fgrade_fld: 1 }
    }

    this._ds._httpRequest('submiteval', { classinfo, request, termvalues }, 1).subscribe((res)=>{
      this.snackbar.open("Response Submitted!", "", this.snackbarConfig);
      this._router.navigate(['main/evaluation']);
    }, er => {
      this.snackbar.open("Unable to submit response! Please try again later.", "", this.snackbarConfig);
    });
    
  }

  isValid(e): any { return this.frmResponse.controls[e].valid; }


  setValidators(): void {
    this.frmResponse = this._formBuilder.group({
      p11_fld: [null, Validators.required],
      p12_fld: [null, Validators.required],
      p13_fld: [null, Validators.required],
      p14_fld: [null, Validators.required],
      p15_fld: [null, Validators.required],

      p21_fld: [null, Validators.required],
      p22_fld: [null, Validators.required],
      p23_fld: [null, Validators.required],
      p24_fld: [null, Validators.required],

      p31_fld: [null, Validators.required],
      p32_fld: [null, Validators.required],
      p33_fld: [null, Validators.required],

      p41_fld: [null, Validators.required],
      p42_fld: [null, Validators.required],
      p43_fld: [null, Validators.required],
      p44_fld: [null, Validators.required],
      p45_fld: [null, Validators.required],

      p51_fld: [null, Validators.required],
      p52_fld: [null, Validators.required],
      p53_fld: [null, Validators.required],
      p54_fld: [null, Validators.required],
      p55_fld: [null, Validators.required],

      p61_fld: [null, Validators.required],
      p62_fld: [null, Validators.required],
      p63_fld: [null, Validators.required],
      p64_fld: [null, Validators.required],
      p65_fld: [null, Validators.required],

      weak_fld: ['', Validators.required],
      strong_fld: ['', Validators.required]
    });
  }
}


export class Questions {
  public Part1: any = [
    { q: 'Presents the subject content clearly',n: 'p11_fld' },
    { q: 'Organizes the discussions very well that I could easily follow through.',n: 'p12_fld' },
    { q: 'Gives sufficient and concrete examples to create meaningful learning experiences.',n: 'p13_fld' },
    { q: 'Relates lesson to actual life situations.',n: 'p14_fld' },
    { q: 'Consistently delivers updated information related to the course content.',n: 'p15_fld' }
  ];

  public Part2: any = [
    { q: 'Uses teaching strategies that enable me to understand the lesson better.',n: 'p21_fld' },
    { q: 'Utilizes methods that make me more interested in and enjoy learning.',n: 'p22_fld' },
    { q: 'Asks questions that encourage me to analyze, to think critically and creatively.',n: 'p23_fld' },
    { q: 'Is able to help me answer difficult questions through examples and simplified follow-up questions.',n: 'p24_fld' }
  ];

  public Part3: any = [
    { q: 'Speaks clearly with well-modulated voice.',n: 'p31_fld' },
    { q: 'Uses words that are easy to understand.',n: 'p32_fld' },
    { q: 'Encourage me to speak up and participate actively in the discussion such as making me share my ideas, exchange views and information.',n: 'p33_fld' }
  ];

  public Part4: any = [
    { q: 'Utilizes teaching strategies that allows students to practice using concept they need to understand (interactive discussion).',n: 'p41_fld' },
    { q: 'Enhances student self-esteem and/or gives due recognition to students performance/potentials.',n: 'p42_fld' },
    { q: 'Allows students to create their own course with objectives realistically, defines student-professor rules and makes them accountable for their performance.',n: 'p43_fld' },
    { q: 'Allows student to think independently and makes their own decisions and holding them accountable for their performance based largely on their success in executing decisions.',n: 'p44_fld' },
    { q: 'Encourages students to learn beyond what is required and helps/guides the student how to apply the concepts learned.',n: 'p45_fld' }
  ];

  public Part5: any = [
    { q: 'Creates opportunities for intensive and/or extensive contribution of the students on the class activities.',n: 'p51_fld' },
    { q: 'Assumes roles of facilitator, resource person, coach, inquisitor, integrator, and/or referee in drawing students to contribute to knowledge and understanding of the concepts at hand.',n: 'p52_fld' },
    { q: 'Designs and implements learning conditions and experience that promote healthy exchange and/or confrontations.',n: 'p53_fld' },
    { q: 'Structures/re-structures learning and teaching-learning context to enhance attainment of collective learning objectives.',n: 'p54_fld' },
    { q: 'Uses instructional Materials (audio/video materials: film showing, computer aided instruction and etc.) to reinforce learning processes.',n: 'p55_fld' }
  ];

  public Part6: any = [
    { q: 'Adapts to both synchronous and asynchronous learning activities to accommodate students varied needs and concerns.',n: 'p61_fld' },
    { q: 'Allows flexibility in assessing students in a variety of ways either offline or online.',n: 'p62_fld' },
    { q: 'Maintains an organized virtual classroom environment by following class schedule and establishes good teacher-student relationship.',n: 'p63_fld' },
    { q: 'Shows knowledge and skills on using technologies and digital platforms such as GCLAMP, e-mail and other appropriate content specific tools and software.',n: 'p64_fld' },
    { q: 'Establishes/demonstrates and applies academic integrity, netiquette (internet etiquette) and expectations regarding lesson activities, discussions, e-mail communication, plagiarism and data privacy',n: 'p65_fld' }
  ];
}