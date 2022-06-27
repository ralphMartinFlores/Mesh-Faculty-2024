import { Component, Inject, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-view-schedule-modal',
  templateUrl: './view-schedule-modal.component.html',
  styleUrls: ['./view-schedule-modal.component.scss']
})
export class ViewScheduleModalComponent implements OnInit {

   // Schedules
   m = [];
   t = [];
   w = [];
   th = [];
   f = [];
   sat = [];
   sun = [];
   index = 1;
   isLoading: boolean = true;
   schedule: any = [];

  constructor(public _ds: DataService, private _user: UserService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.schedule = this.data.data;
    this.setSchedule();
    
  }

  convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    if (hours.length == 1) {
      hours = '0'.concat(hours);
    }

    return `${hours}:${minutes}`;
  }

  sortField(field, isOrdered) {
    return (a, b) => {
      if (isOrdered) {
        return a[field].toString().localeCompare(b[field].toString());
      }
      return b[field].toString().localeCompare(a[field].toString());
    };

  }

  setSchedule(){
    for (let i = 0; i < this.schedule.length; i++) {
      let sched = this.schedule[i].day_fld;

      if (sched.match('Mon')) {
        let time = this.convertTime12to24(this.schedule[i].starttime_fld);
        let mondaySched = {
          'id': i + this.index,
          'subject': this.schedule[i].subjdesc_fld,
          'startTime': this.schedule[i].starttime_fld,
          'endTime': this.schedule[i].endtime_fld,
          'date': '2016-12-07T' + time,
          'SubjectCode': this.schedule[i].subjcode_fld
        }
        this.m.push(mondaySched);
      }
      if (sched.match('Tue')) {
        let time = this.convertTime12to24(this.schedule[i].starttime_fld);
        let mondaySched = {
          'id': i + this.index,
          'subject': this.schedule[i].subjdesc_fld,
          'startTime': this.schedule[i].starttime_fld,
          'endTime': this.schedule[i].endtime_fld,
          'date': '2016-12-07T' + time,
          'SubjectCode': this.schedule[i].subjcode_fld
        }
        this.t.push(mondaySched);
      }
      if (sched.match('Wed')) {
        let time = this.convertTime12to24(this.schedule[i].starttime_fld);
        let mondaySched = {
          'id': i + this.index,
          'subject': this.schedule[i].subjdesc_fld,
          'startTime': this.schedule[i].starttime_fld,
          'endTime': this.schedule[i].endtime_fld,
          'date': '2016-12-07T' + time,
          'SubjectCode': this.schedule[i].subjcode_fld
        }
        this.w.push(mondaySched);
      }
      if (sched.match('Thu')) {
        let time = this.convertTime12to24(this.schedule[i].starttime_fld);
        let mondaySched = {
          'id': i + this.index,
          'subject': this.schedule[i].subjdesc_fld,
          'startTime': this.schedule[i].starttime_fld,
          'endTime': this.schedule[i].endtime_fld,
          'date': '2016-12-07T' + time,
          'SubjectCode': this.schedule[i].subjcode_fld
        }
        this.th.push(mondaySched);
      }
      if (sched.match('Fri')) {
        let time = this.convertTime12to24(this.schedule[i].starttime_fld);
        let mondaySched = {
          'id': i + this.index,
          'subject': this.schedule[i].subjdesc_fld,
          'startTime': this.schedule[i].starttime_fld,
          'endTime': this.schedule[i].endtime_fld,
          'date': '2016-12-07T' + time,
          'SubjectCode': this.schedule[i].subjcode_fld
        }
        this.f.push(mondaySched);
      }
      if (sched.match('Sat')) {
        let time = this.convertTime12to24(this.schedule[i].starttime_fld);
        let mondaySched = {
          'id': i + this.index,
          'subject': this.schedule[i].subjdesc_fld,
          'startTime': this.schedule[i].starttime_fld,
          'endTime': this.schedule[i].endtime_fld,
          'date': '2016-12-07T' + time,
          'SubjectCode': this.schedule[i].subjcode_fld
        }
        this.sat.push(mondaySched);
      }
      if (sched.match('Sun')) {
        let time = this.convertTime12to24(this.schedule[i].starttime_fld);
        let mondaySched = {
          'id': i + this.index,
          'subject': this.schedule[i].subjdesc_fld,
          'startTime': this.schedule[i].starttime_fld,
          'endTime': this.schedule[i].endtime_fld,
          'date': '2016-12-07T' + time,
          'SubjectCode': this.schedule[i].subjcode_fld
        }
        this.sun.push(mondaySched);
      }

      this.m.sort(this.sortField('date', true));
      this.t.sort(this.sortField('date', true));
      this.w.sort(this.sortField('date', true));
      this.th.sort(this.sortField('date', true));
      this.f.sort(this.sortField('date', true));
      this.sat.sort(this.sortField('date', true));
      this.sun.sort(this.sortField('date', true));

    }
  }

}
