import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ViewDataOnlyComponent } from 'src/app/shared/components/view-data-only/view-data-only.component';
import { staggereffect } from 'src/app/shared/animation/animation';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss'],
  animations: [
    staggereffect
  ]
})
export class ClassesComponent implements OnInit {

  date = new Date();
  allClasses: any[] = [];
  classes: any[] = [];
  scheduleObject: any[] = [];
  showLoader: boolean = true;

  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);

  constructor(private breakpointObserver: BreakpointObserver, public dialog: MatDialog, private _ds: DataService, private _user: UserService) { }

  ngOnInit(): void {
    this.initializeComponents();
    setInterval(() => {
      this.date = new Date();
    }, 1000);
  }


  initializeComponents() {
    this.getFacultyClasses();
  }

  enterClassroom(item) {
    this._user.setClassroomInfo(item);
  }

  getFacultyClasses() {
    let load = {
      data: {
        email: this._user.getUserEmail(),
        acadyear: this._user.getSettings().acadyear_fld,
        semester: this._user.getSettings().sem_fld
      }
    }
    this._ds._httpRequest('getclasslist', load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.allClasses = this.sortClass(dt.payload);
      this.classes = this.allClasses;
      console.log(this.classes)
      this.getClassSchedules();
      this.showLoader = false;
    }, er => {
      er = this._user._decrypt(er.error.a);
      this.classes = er.payload;
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


  getClassSchedules() {
    let mon = [], tue = [], thu = [], wed = [], fri = [], sat = [], sun = []
    if (this.allClasses != null) {
      this.classes.forEach((el) => {
        if (el.day_fld.match('Mon')) {
          mon.push({
            day_fld: 'mon',
            starttime_fld: el.starttime_fld,
            endtime_fld: el.endtime_fld,
            subjdesc_fld: el.subjdesc_fld,
            subjcode_fld: el.subjcode_fld,
            block_fld: el.block_fld
          })
        }
        if (el.day_fld.match('Tue')) {
          tue.push({
            day_fld: 'tue',
            starttime_fld: el.starttime_fld,
            endtime_fld: el.endtime_fld,
            subjdesc_fld: el.subjdesc_fld,
            subjcode_fld: el.subjcode_fld,
            block_fld: el.block_fld
          })
        }
        if (el.day_fld.match('Wed')) {
          wed.push({
            day_fld: 'wed',
            starttime_fld: el.starttime_fld,
            endtime_fld: el.endtime_fld,
            subjdesc_fld: el.subjdesc_fld,
            subjcode_fld: el.subjcode_fld,
            block_fld: el.block_fld
          })
        }
        if (el.day_fld.match('Thu')) {
          thu.push({
            day_fld: 'thu',
            starttime_fld: el.starttime_fld,
            endtime_fld: el.endtime_fld,
            subjdesc_fld: el.subjdesc_fld,
            subjcode_fld: el.subjcode_fld,
            block_fld: el.block_fld
          })
        }
        if (el.day_fld.match('Fri')) {
          fri.push({
            day_fld: 'fri',
            starttime_fld: el.starttime_fld,
            endtime_fld: el.endtime_fld,
            subjdesc_fld: el.subjdesc_fld,
            subjcode_fld: el.subjcode_fld,
            block_fld: el.block_fld
          })
        }
        if (el.day_fld.match('Sat')) {
          sat.push({
            day_fld: 'sat',
            starttime_fld: el.starttime_fld,
            endtime_fld: el.endtime_fld,
            subjdesc_fld: el.subjdesc_fld,
            subjcode_fld: el.subjcode_fld,
            block_fld: el.block_fld
          })
        }
        if (el.day_fld.match('Sun')) {
          sun.push({
            day_fld: 'sun',
            starttime_fld: el.starttime_fld,
            endtime_fld: el.endtime_fld,
            subjdesc_fld: el.subjdesc_fld,
            subjcode_fld: el.subjcode_fld,
            block_fld: el.block_fld
          })
        }
      });
      this.scheduleObject.push(mon, tue, wed, thu, fri, sat, sun);
    }
  }


  ViewSchedule() {
    let data = {
      "type": 'schedule',
      "data": this.scheduleObject,
    };
    const dialogRef = this.dialog.open(ViewDataOnlyComponent, {
      panelClass: '',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: data
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('100%', 'auto');
      } else {
        dialogRef.updateSize('100%', 'auto');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
    });
  }
}
