import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

import { v4 as uuidV4 } from 'uuid';

@Component({
  selector: 'app-sched-meeting',
  templateUrl: './sched-meeting.component.html',
  styleUrls: ['./sched-meeting.component.scss']
})

export class SchedMeetingComponent implements OnInit {
  interval: number = 60;
  participants = new FormControl();
  facultyList: string[] = ['Mr. Melner Balce', 'Mr. Paul Corsina', 'Mrs. Erlinda Casela-Abarintos', 'Ms. Sharmaigne Manuel', 'Mr. Armie Armada', 'Mr. Ronnie Luy'];

  allStudents: any = [];
  students: any = [];

  roomId: string = '';

  form: FormGroup;

  constructor(private route: Router,
    public _user: UserService, 
    private _ds: DataService,
    public formBuilder: FormBuilder) { }

  async ngOnInit() {
    this.roomId = uuidV4();
    this.getClassList();
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      title_fld: [null, Validators.required],
      classcode_fld: [this.route.url.split('/')[3], Validators.required],
      startdate_fld: [null, Validators.required],
      starttime_fld: [null, Validators.required],
      enddate_fld: [null, Validators.required],
      endtime_fld: [null, Validators.required],
      roomid_fld: [this.roomId, Validators.required],
      desc_fld: [null, Validators.required]
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
    this._ds._httpRequest('getmembers', load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this._user.setClassMembers(dt.payload);

      this.allStudents = this._user.getClassMembers().student;
      this.students = this.allStudents;
      console.log(this.students)
      
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }

  onSubmit() {
    const load: any = this.form.value;
    this._ds._httpRequest('newmeeting', load, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      console.log(dt); // success 200
    }, er => {
      er = this._user._decrypt(er.error.a);
    });
  }

}
