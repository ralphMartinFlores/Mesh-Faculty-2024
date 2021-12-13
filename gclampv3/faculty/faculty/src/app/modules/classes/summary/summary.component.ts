import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ExportExcelService } from 'src/app/services/export-excel.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {


  summaryObj: any = [];
  studentsObj: any = [];
  submissionObj: any = []
  actObj: any = []
  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog, private route: Router,
    public _ds: DataService,
    public _user: UserService,
    private excelExport: ExportExcelService
  ) { }

  ngOnInit(): void {
    this.getClassList();
  }

  getClassList() {
    let load = {
      data: {
        classcode: this._user.getClassroomInfo().classcode_fld,
        acadyear: this._user.getSettings().acadyear_fld,
        semester: this._user.getSettings().sem_fld
      }
    }
    this._ds._httpRequest('getmembers', load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this._user.setClassMembers(dt.payload);
      this.studentsObj = dt.payload.student;
      this.getSummaryScores();
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }

  getSummaryScores() {
    let load = {
      data: { classcode: this._user.getClassroomInfo().classcode_fld, }
    }
    this._ds._httpRequest('getsummary', load, 1).subscribe( async (dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.submissionObj =  await dt.payload.sub
      this.summaryObj = await this.getSummaryObject(dt.payload.act, dt.payload.sub)
    
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }

  getScore(s: string, list: any): any {
    let a: any;
    try { 
        a = `${list.students[s].score_fld} ${list.students[s].score_fld > 1?'pts':'pt'}`;
    } catch {
      return 'N/A';
    }
    return a;
  }


  exportScores() {
    let dataForExcel: any = [];
    let tmp: any = [];
    this.summaryObj.forEach(element => {

    });
  }

  exportToExcel() {

    let dataForExcel: any = [];
    let tmp: any = [];

    this.studentsObj.forEach((row: any, i) => {

      tmp[i] = { No: i + 1, StudentID: row.studnum_fld, StudentName: row.lname_fld + ', ' + row.fname_fld }
      this.summaryObj.map((element, j) => {
        tmp[i][element.title] = this.getScore(row.studnum_fld, element)
      })
    })

    tmp.forEach(element => {
      dataForExcel.push(Object.values(element));
    });
    let activeClass: any = this._user.getClassroomInfo();

    let tmpSubjCode: string = activeClass.subjcode_fld;
    tmpSubjCode = tmpSubjCode.replace(/[^a-zA-Z0-9]/g, '');
    let tmpSubjDesc: string = activeClass.subjdesc_fld;
    tmpSubjDesc = tmpSubjDesc.replace(/[^a-zA-Z0-9]/g, '');
    let tmpSchedule: string = activeClass.day_fld + ' ' + activeClass.starttime_fld + '-' + activeClass.endtime_fld;


    let reportData = {
      title: 'Summary of Scores_' + activeClass.classcode_fld + '-' + tmpSubjCode,
      title1: activeClass.classcode_fld + ' - ' + tmpSubjCode,
      title2: tmpSubjDesc,
      title3: tmpSchedule,
      data: dataForExcel,
      headers: Object.keys(tmp[0])
    }
    this.excelExport.exportScores(reportData);
  }


  getSummaryObject(act, sub){
    let sumObj: any = []
    act.forEach(element => {
      sumObj.push({
        actcode: element.actcode_fld,
        title: element.title_fld,
        totalscore: element.totalscore_fld,
        students: this.getStudentScore(element.recipient_fld.split('.'), element.actcode_fld)
      })
    })
    return sumObj

  }

  getStudentScore(recipients, actcode){
    let studobj: any = [];
    let nosub = {
      score_fld: 0,
      issubmitted_fld: 0,
      isscored_fld: 0
    }
    recipients.forEach(element => {
        if(this.submissionObj == null){
          studobj[element] = nosub
        }
        else{
          studobj[element] = this.submissionObj
          .find( (item: any ) => {
            return item.actcode_fld == actcode && item.studnum_fld == element    
          }) || nosub
        }     
    }); 

    return studobj
  }

  


}


