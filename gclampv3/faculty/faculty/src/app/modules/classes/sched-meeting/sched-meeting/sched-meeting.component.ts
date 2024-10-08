import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl,  FormGroupDirective, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { Clipboard } from "@angular/cdk/clipboard";

import { v4 as uuidV4 } from 'uuid';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sched-meeting',
  templateUrl: './sched-meeting.component.html',
  styleUrls: ['./sched-meeting.component.scss']
})
export class SchedMeetingComponent implements OnInit {
  p: number = 1;
  interval: number = 60;
  timerange = new FormControl();
  participants = new FormControl();
  recurrence: any [] = [
    {value: 0, type: 'Does not repeat'},
    {value: 1, type: 'Repeat Daily'},
    {value: 2, type: 'Repeat Weekly'}
  ];
  time: string[] = ['12:00 AM', '12:15 AM', '12:30 AM', '12:45 AM', '1:00 AM', 
                    '1:15 AM', '1:30 AM', '1:45 AM', '2:00 AM', '2:15 AM', '2:30 AM',
                    '2:45 AM', '3:00 AM', '3:15 AM', '3:30 AM', '3:45 AM', '4:00 AM',
                    '4:15 AM', '4:30 AM', '4:45 AM', '5:00 AM', '5:15 AM', '5:30 AM',
                    '5:45 AM', '6:00 AM', '6:15 AM', '6:30 AM', '6:45 AM', '7:00 AM',
                    '7:15 AM', '7:30 AM', '7:45 AM', '8:00 AM', '8:15 AM', '8:30 AM',
                    '8:45 AM', '9:00 AM', '9:15 AM', '9:30 AM', '9:45 AM', '10:00 AM',
                    '10:15 AM', '10:30 AM', '10:45 AM', '11:00 AM', '11:15 AM', '11:30 AM',
                    '11:45 AM', '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM', '1:00 PM',
                    '1:15 PM', '1:30 PM', '1:45 PM', '2:00 PM', '2:15 PM', '2:30 PM',
                    '2:45 PM', '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM', '4:00 PM',
                    '4:15 PM', '4:30 PM', '4:45 PM', '5:00 PM', '5:15 PM', '5:30 PM',
                    '5:45 PM', '6:00 PM', '6:15 PM', '6:30 PM', '6:45 PM', '7:00 PM',
                    '7:15 PM', '7:30 PM', '7:45 PM', '8:00 PM', '8:15 PM', '8:30 PM',
                    '8:45 PM', '9:00 PM', '9:15 PM', '9:30 PM', '9:45 PM', '10:00 PM',
                    '10:15 PM', '10:30 PM', '10:45 PM', '11:00 PM', '11:15 PM', '11:30 PM',
                    '11:45 PM']
  facultyList: string[] = ['Mr. Melner Balce', 'Mr. Paul Corsina', 'Mrs. Erlinda Casela-Abarintos', 'Ms. Sharmaigne Manuel', 'Mr. Armie Armada', 'Mr. Ronnie Luy'];

  allStudents: any = [];
  students: any = [];

  roomId: string = '';

  form: FormGroup;
  private sub: any;

  constructor(private route: Router,
    public _user: UserService, 
    private _ds: DataService,
    private clipboard: Clipboard,
    private _snackBar: MatSnackBar,
    public formBuilder: FormBuilder, 
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute
    ) { }

  editMeetings: boolean = true;
  recno_fld: any;
  async ngOnInit() {
    let classCode = this._user.getClassroomInfo().classcode_fld
    if (this.activatedRoute.snapshot.paramMap.get('roomcode') !== classCode){
      this.getScheduledMeeting(this.activatedRoute.snapshot.paramMap.get('roomcode'));
      this.editMeetings =true
    } else { 
      this.editMeetings = false 
      this.roomId = uuidV4();
    }
    this.getClassList();

    this.initializeForm();
  }

  getScheduledMeeting(recno_fld: any){
    let load = {
      data: {
        recno_fld: recno_fld,
      }
    }
    let data: any
    this._ds._httpRequest('getScheduledMeeting', load, 1).subscribe(async ( dt: any) => {
      dt = this._user._decrypt(dt.a);
      if (dt.status.remarks === 'success'){
        data = dt.payload;
        let obj : any= {}
        data.forEach(item => {
          obj.recno_fld = item.recno_fld,
          obj.recurrence_fld = item.recurrence_fld,
          obj.classcode_fld = item.classcode_fld,
          obj.startdate_fld = item.startdate_fld,
          obj.meetstarttime_fld = this.formatTimeShow(item.meetstarttime_fld).toUpperCase(),
          obj.enddate_fld = item.enddate_fld,
          obj.meetendtime_fld = this.formatTimeShow(item.meetendtime_fld).toUpperCase(),
          this.roomId = item.roomid_fld,
          obj.desc_fld = item.desc_fld

        })        
        this.form.patchValue(obj);
      }

    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }

  initializeForm() {
    const title: string = `${this._user.getClassroomInfo().subjdesc_fld} - ${this._user.getClassroomInfo().classcode_fld}`
    const starttime : string = `${this._user.getClassroomInfo().starttime_fld}`
    const endtime : string = `${this._user.getClassroomInfo().endtime_fld}`
    // const tomorrowsDate = new Date();
    // tomorrowsDate.setDate(tomorrowsDate.getDate() + 1);
    this.form = this.formBuilder.group({
      recno_fld: [''], 
      title_fld: [title, [Validators.required]],
      recurrence_fld: [''], 
      classcode_fld: [this.route.url.split('/')[3], Validators.required],
      startdate_fld: [new Date(), [Validators.required]],
      meetstarttime_fld: [starttime.toUpperCase(), [Validators.required]],
      enddate_fld: [new Date(), [Validators.required]],
      meetendtime_fld: [endtime.toUpperCase(), [Validators.required]],
      roomid_fld: [this.roomId],
      desc_fld: ['']
    });
  }

  getClassList() {
    let load = {
      data: {
        classcode: this._user.getClassroomInfo().classcode_fld,
        acadyear: this._user.getSettings().acadyear_fld,
        semester: this._user.getSettings().sem_fld
      }
    }
    // console.log(this._user.getClassroomInfo())
    this._ds._httpRequest('getmembers', load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this._user.setClassMembers(dt.payload);

      this.allStudents = this._user.getClassMembers().student;
      this.students = this.allStudents;
      console.log(this.students);
      
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }


  

  public convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(' ');
  
    let [hours, minutes] = time.split(':');
  
    if (hours === '12') {
      hours = '00';
    }
  
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
  
    return `${hours}:${minutes}`;
  }

  onSubmit() {
    const load: any = this.form.value;
    load.meetstarttime_fld = this.convertTime12to24(load.meetstarttime_fld)
    load.meetendtime_fld = this.convertTime12to24(load.meetendtime_fld)
    load.empcode_fld = this._user.getUserID();
    if (!this.editMeetings){
      delete load.recno_fld;

      this._ds._httpRequest('newmeeting', load, 1).subscribe((dt: any) => {
        dt = this._user._decrypt(dt.a);
        this._displaySnackBar('Added a meeting successfully!', 'Close', 'success', 'bottom');
        setTimeout(()=> this.clearMeetingForm(), 2000);
      }, er => { er = this._user._decrypt(er.error.a); });
    } else {
      this._ds._httpRequest('editMeeting', load, 1).subscribe((dt: any) => {
        dt = this._user._decrypt(dt.a);
        if (dt.payload === 200){
          this._displaySnackBar('Updated a meeting successfully!', 'Close', 'success', 'bottom');
        }
      });
    }
  }

  onCopy(value:any):void {
    this.clipboard.copy(value);
    this._displaySnackBar('Copied to clipboard', 'Close', 'success', 'bottom');

  }


  clearMeetingForm(): void{
    this.form.reset();
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key).setErrors(null);
    })
  }

  public formatTimeShow(time) {
    let hour = (time.split(':'))[0]
    let min = (time.split(':'))[1]
    let part = hour > 12 ? 'PM' : 'AM';
    
    min = (min).length == 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour).length == 1 ? `0${hour}` : hour;
  
    return (`${hour}:${min} ${part}`)
  }
  
  _displaySnackBar = (message: string, action: string, pc: string, pos: any): any => this._snackBar.open(message, action, { panelClass: pc, verticalPosition: pos, duration: 3000 });


}
