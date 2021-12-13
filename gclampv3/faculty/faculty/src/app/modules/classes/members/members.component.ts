import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ViewDataOnlyComponent } from 'src/app/shared/components/view-data-only/view-data-only.component';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { StudentworksComponent } from 'src/app/shared/components/studentworks/studentworks.component';
import { AddstudentComponent } from 'src/app/shared/components/addstudent/addstudent.component';
import { PageEvent } from '@angular/material/paginator';
import { ExportExcelService } from 'src/app/services/export-excel.service';


@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  allStudents: any = [];
  students: any = [];
  studentact: any = [];
  pageslice;
  classmembersinfo: any = [];

  constructor(private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public _ds: DataService,
    public _user: UserService,
    private excelExport: ExportExcelService) { }

  ngOnInit(): void {
    this.initializeComponents();
  }

  initializeComponents() {
    this.getStudentWorks();
    this.allStudents = this._user.getClassMembers().student;
    this.students = this.allStudents;
  }

  filterStudents(ev) {
    let searchItem: string = ev.target.value;
    this.students = this.allStudents.filter((x)=>{
      return (
        x.lname_fld.toUpperCase().includes(searchItem.toUpperCase()) ||
        x.fname_fld.toUpperCase().includes(searchItem.toUpperCase()) ||
        x.studnum_fld.toUpperCase().includes(searchItem.toUpperCase())
      );
    });
  }

  ViewStudentInfo(info) {
    let data = {
      "type": 'academic',
      "data": info
    };
    const dialogRef = this.dialog.open(ViewDataOnlyComponent, {
      panelClass: 'academic-modalbox',
      // backdropClass: 'g-transparent-backdrop',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: data
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('98%', 'auto');
      } else {
        dialogRef.updateSize('50%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();

    });
  }

  ViewStudentActivities(info) {
    let data = {
      "type": 'academic',
      "data": info
    };
    const dialogRef = this.dialog.open(StudentworksComponent, {
      panelClass: 'academic-modalbox',
      // backdropClass: 'g-transparent-backdrop',
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

    });
  }

  getStudentWorks() {

    this._user.setLoading(true);
    let load = {
      data: {
        classcode: this._user.getClassroomInfo().classcode_fld,
        actcode: '',
        type: 'act',
        acadyear: this._user.getSettings().acadyear_fld,
        semester: this._user.getSettings().sem_fld
      }
    }

    this._ds._httpRequest('getstudworks', load, 1).subscribe(async (dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.studentact = await dt.payload;
      this.studentact.map((act) => {
        this.students.map((cl) => {
          if (act.studnum_fld === cl.studnum_fld) {
            cl.activity = act.activity;
          }
        });
      });
      this.pageslice = this.students;
      this._user.setLoading(false);
    }, er => {
      er = this._user._decrypt(er.error.a);
      this._user.setLoading(false);
    });
  }

  exportToExcel() {
    let dataForExcel: any = [];
    let tmp: any = [];
    this.students.forEach((row: any, i) => {
      tmp.push({
        No: i + 1,
        StudentID: row.studnum_fld,
        StudentName: row.lname_fld + ', ' + row.fname_fld + ', ' + row.mname_fld,
        Program: row.program_fld,
        Block: row.block_fld,
        ContactNumber: row.contactnum_fld,
        EmailAdd: row.email_fld,
        LearningMode: row.learningtype_fld
      });
    });

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
      title: 'Student List_' + activeClass.classcode_fld + '-' + tmpSubjCode,
      title1: activeClass.classcode_fld + ' - ' + tmpSubjCode,
      title2: tmpSubjDesc,
      title3: tmpSchedule,
      data: dataForExcel,
      headers: Object.keys(tmp[0])
    }

    this.excelExport.exportExcel(reportData);
  }
}
