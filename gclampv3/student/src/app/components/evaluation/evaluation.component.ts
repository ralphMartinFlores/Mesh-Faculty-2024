import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { staggereffect } from '../class/animation';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
  animations: [
    staggereffect
  ]
})
export class EvaluationComponent implements OnInit {
  allClasses: any[] = [];
  classes: any[] = [];
  teachersList = [];
  isLoading: boolean = true;
  schedule=[];
  perfectscore = [];
  score: number;
  showLoader : boolean = true;
  quests: any;

  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  constructor(
    public _user: UserService,
    public _ds:DataService, 
    private _router: Router,
    public dialog: MatDialog, 
    private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.getClass();
  }

  getClass() {
    this._ds._httpRequest('getclasslist', {userid: this._user.getUserID(),acadyear:this._user.getAcadYear(),semester:this._user.getSemester() }, 1).subscribe((res: any)=>{
      res = this._user._decrypt(res.a);
      this.allClasses = this.sortClass(res.payload);
      this.classes = this.allClasses;
      this._user.setStudentSchedule(this.classes);
      this.isLoading = false;
      this.showLoader = false;
    },er =>{
      er = this._user._decrypt(er.error.a);
      this.classes = [];
      this._user.setStudentSchedule(this.classes);
      this.showLoader = false;
    });
  }

  filterClass(ev) {
    let searchItem: string = ev.target.value;
    this.classes = this.allClasses.filter((x)=>{
      return (
        x.classcode_fld.toUpperCase().includes(searchItem.toUpperCase()) ||
        x.subjcode_fld.toUpperCase().includes(searchItem.toUpperCase()) ||
        x.subjdesc_fld.toUpperCase().includes(searchItem.toUpperCase())
      );
    });
  }

  sortClass(payload): any {
    let arrDays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let tmp: any = payload;
    let items: any[]=[];

    arrDays.forEach(x => {
      tmp.forEach(y => {
        let found=0;
        if(y.day_fld.includes(x)) {
          items.forEach(z=>{
            if(y.classcode_fld==z.classcode_fld) found = 1;
          });
          if(found!=1) items.push(y);
        }
      });
    });
    return items
  }

  viewQuestionnaire(data: any) {
    this._user.setSelectedClass(data);  
    this._router.navigate(['/main/questionnaire']);
  }

  isHidden(mgrade, fgrade){
    let var_hide: boolean = false;
    if(this._user.getSettings().activeterm_fld==1) {
      if(mgrade==1) var_hide=true;
    } else {
      if(fgrade==1) var_hide=true;
    }
    return var_hide;
  }

  getDays(vDays): string {
    let tmp: string = '';
    if(vDays.includes('Mon')) { tmp+='M'; }
    if(vDays.includes('Tue')) { tmp+='T'; }
    if(vDays.includes('Wed')) { tmp+='W'; }
    if(vDays.includes('Thu')) { tmp+='Th'; }
    if(vDays.includes('Fri')) { tmp+='F'; }
    if(vDays.includes('Sat')) { tmp+='Sat'; }
    if(vDays.includes('Sun')) { tmp+='Sun'; }

    return tmp;
  }

}
