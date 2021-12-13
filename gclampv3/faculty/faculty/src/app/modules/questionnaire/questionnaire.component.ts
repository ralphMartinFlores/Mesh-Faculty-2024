import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit {
  class: any = [];
  questions: any = new Questions();
  constructor(
    private _ds: DataService,
    public _user: UserService
  ) { }

  ngOnInit(): void {
    this.class = this._user.getClassroomInfo();
    this.getEvaluationResult();
  }

  getEvaluationResult() {
    let classcode = this.class.classcode_fld;
    this._ds._httpRequest('evalresult', { classcode }, 1).subscribe((res)=>{
      res = this._user._decrypt(res.a);
      // let evaluation = res.payload[0];
      this.getValues(res.payload[0]);
      console.log(res.payload[0]);
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }

  averageP1: number = 0;
  getValues(res){
    this.questions.Part1[0].v = res.p11_fld;
    this.questions.Part1[1].v = res.p12_fld;
    this.questions.Part1[2].v = res.p13_fld;
    this.questions.Part1[3].v = res.p14_fld;
    this.questions.Part1[4].v = res.p15_fld;

    this.questions.Part2[0].v = res.p21_fld;
    this.questions.Part2[1].v = res.p22_fld;
    this.questions.Part2[2].v = res.p23_fld;
    this.questions.Part2[3].v = res.p24_fld;

    this.questions.Part3[0].v = res.p31_fld;
    this.questions.Part3[1].v = res.p32_fld;
    this.questions.Part3[2].v = res.p33_fld;

    this.questions.Part4[0].v = res.p41_fld;
    this.questions.Part4[1].v = res.p42_fld;
    this.questions.Part4[2].v = res.p43_fld;
    this.questions.Part4[3].v = res.p44_fld;
    this.questions.Part4[4].v = res.p45_fld;

    this.questions.Part5[0].v = res.p51_fld;
    this.questions.Part5[1].v = res.p52_fld;
    this.questions.Part5[2].v = res.p53_fld;
    this.questions.Part5[3].v = res.p54_fld;
    this.questions.Part5[4].v = res.p55_fld;

    this.questions.Part6[0].v = res.p61_fld;
    this.questions.Part6[1].v = res.p62_fld;
    this.questions.Part6[2].v = res.p63_fld;
    this.questions.Part6[3].v = res.p64_fld;
    this.questions.Part6[4].v = res.p65_fld;
  }

}


export class Questions {
  public Part1: any = [
    { q: 'Presents the subject content clearly',n: 'p11_fld', v: '0' },
    { q: 'Organizes the discussions very well that I could easily follow through.',n: 'p12_fld', v: '0' },
    { q: 'Gives sufficient and concrete examples to create meaningful learning experiences.',n: 'p13_fld', v: '0' },
    { q: 'Relates lesson to actual life situations.',n: 'p14_fld', v: '0' },
    { q: 'Consistently delivers updated information related to the course content.',n: 'p15_fld', v: '0' }
  ];

  public Part2: any = [
    { q: 'Uses teaching strategies that enable me to understand the lesson better.',n: 'p21_fld', v: '0' },
    { q: 'Utilizes methods that make me more interested in and enjoy learning.',n: 'p22_fld', v: '0' },
    { q: 'Asks questions that encourage me to analyze, to think critically and creatively.',n: 'p23_fld', v: '0' },
    { q: 'Is able to help me answer difficult questions through examples and simplified follow-up questions.',n: 'p24_fld', v: '0' }
  ];

  public Part3: any = [
    { q: 'Speaks clearly with well-modulated voice.',n: 'p31_fld', v: '0' },
    { q: 'Uses words that are easy to understand.',n: 'p32_fld', v: '0' },
    { q: 'Encourages me to speak up and participate actively in the discussion such as making me share my ideas, exchange views and information.',n: 'p33_fld', v: '0' }
  ];

  public Part4: any = [
    { q: 'Utilizes teaching strategies that allows students to practice using concept they need to understand (interactive discussion).',n: 'p41_fld', v: '0' },
    { q: 'Enhances student self-esteem and/or gives due recognition to students performance/potentials.',n: 'p42_fld', v: '0' },
    { q: 'Allows students to create their own course with objectives realistically, defines student-professor rules and makes them accountable for their performance.',n: 'p43_fld', v: '0' },
    { q: 'Allows student to think independently and makes their own decisions and holding them accountable for their performance based largely on their success in executing decisions.',n: 'p44_fld', v: '0' },
    { q: 'Encourages students to learn beyond what is required and helps/guides the student how to apply the concepts learned.',n: 'p45_fld', v: '0' }
  ];

  public Part5: any = [
    { q: 'Creates opportunities for intensive and/or extensive contribution of the students on the class activities.',n: 'p51_fld', v: '0' },
    { q: 'Assumes roles of facilitator, resource person, coach, inquisitor, integrator, and/or referee in drawing students to contribute to knowledge and understanding of the concepts at hand.',n: 'p52_fld', v: '0' },
    { q: 'Designs and implements learning conditions and experience that promote healthy exchange and/or confrontations.',n: 'p53_fld', v: '0' },
    { q: 'Structures/re-structures learning and teaching-learning context to enhance attainment of collective learning objectives.',n: 'p54_fld', v: '0' },
    { q: 'Uses instructional Materials (audio/video materials: film showing, computer aided instruction and etc.) to reinforce learning processes.',n: 'p55_fld', v: '0' }
  ];

  public Part6: any = [
    { q: 'Adapts to both synchronous and asynchronous learning activities to accommodate students varied needs and concerns.',n: 'p61_fld', v: '0' },
    { q: 'Allows flexibility in assessing students in a variety of ways either offline or online.',n: 'p62_fld', v: '0' },
    { q: 'Maintains an organized virtual classroom environment by following class schedule and establishes good teacher-student relationship.',n: 'p63_fld', v: '0' },
    { q: 'Shows knowledge and skills on using technologies and digital platforms such as GCLAMP, e-mail and other appropriate content specific tools and software.',n: 'p64_fld', v: '0' },
    { q: 'Establishes/demonstrates and applies academic integrity, netiquette (internet etiquette) and expectations regarding lesson activities, discussions, e-mail communication, plagiarism and data privacy',n: 'p65_fld', v: '0' }
  ];
}
