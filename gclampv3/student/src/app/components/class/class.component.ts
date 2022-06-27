import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { ViewScheduleModalComponent } from './view-schedule-modal/view-schedule-modal.component';
import { staggereffect } from './animation';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss'],
    animations: [
    staggereffect
  ]
})
export class ClassComponent implements OnInit {
  allClasses: any[]= [];
  classes: any[] = [];
  teachersList: any[] = [];
  isLoading: boolean = true;
  schedule: any = [];
  perfectscore: any = [];
  score: number;
  showLoader : boolean = true;
  quests: any;
  date = new Date();

  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  constructor(public _user:UserService,public _ds:DataService, public dialog: MatDialog, private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.getClass();

    setInterval(() => {
      this.date = new Date();
    }, 1000);
  }

  getClass() {
    this._ds._httpRequest('getclasslist', { userid: this._user.getUserID(), acadyear:this._user.getAcadYear(), semester:this._user.getSemester() }, 1).subscribe((res: any)=>{
      res = this._user._decrypt(res.a);
      this.allClasses = this.sortClass(res.payload);
      this.classes = this.allClasses;
      this._user.setStudentSchedule(this.allClasses);
      this.isLoading = false;
      this.showLoader = false;
    },er =>{
      er = this._user._decrypt(er.error.a);
      this.allClasses = [];
      this.classes = [];
      this._user.setStudentSchedule(this.allClasses);
      this.showLoader = false
    });
  }

  viewclass(data) {
    this._user.setSelectedClass(data);   
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

  openDialog() {
    let data = {
      "data": this.allClasses,
    };
    const dialogRef = this.dialog.open(ViewScheduleModalComponent, {
      panelClass: 'dialogpadding',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: data
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      dialogRef.updateSize('100%', 'auto');
      
      // if (result.matches) {
      //   dialogRef.updateSize('100%', 'auto');
      // } else {
      //   dialogRef.updateSize('100%', 'auto');
      // }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
    });
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
