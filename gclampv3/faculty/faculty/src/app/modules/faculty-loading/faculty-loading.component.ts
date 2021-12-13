import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';
import { UpdateProfilePictureComponent } from 'src/app/shared/components/update-profile-picture/update-profile-picture.component';
import { KeyImage } from 'src/app/services/data.schema';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var $: any;

@Component({
  selector: 'app-faculty-loading',
  templateUrl: './faculty-loading.component.html',
  styleUrls: ['./faculty-loading.component.scss'],
})
export class FacultyLoadingComponent implements OnInit {
  signaturePath: string = "";  

  officialTime: any = [
    { day: 'Monday', amin: '', amout: '', pmin: '', pmout: '' },
    { day: 'Tuesday', amin: '', amout: '', pmin: '', pmout: '' },
    { day: 'Wednesday', amin: '', amout: '', pmin: '', pmout: '' },
    { day: 'Thursday', amin: '', amout: '', pmin: '', pmout: '' },
    { day: 'Friday', amin: '', amout: '', pmin: '', pmout: '' },
    { day: 'Saturday', amin: '', amout: '', pmin: '', pmout: '' },
    { day: 'Sunday', amin: '', amout: '', pmin: '', pmout: '' },
  ];

  consultTime: any = [
    {
      day: 'Monday',
      consamfrom: '',
      consamto: '',
      conspmfrom: '',
      conspmto: '',
    },
    {
      day: 'Tuesday',
      consamfrom: '',
      consamto: '',
      conspmfrom: '',
      conspmto: '',
    },
    {
      day: 'Wednesday',
      consamfrom: '',
      consamto: '',
      conspmfrom: '',
      conspmto: '',
    },
    {
      day: 'Thursday',
      consamfrom: '',
      consamto: '',
      conspmfrom: '',
      conspmto: '',
    },
    {
      day: 'Friday',
      consamfrom: '',
      consamto: '',
      conspmfrom: '',
      conspmto: '',
    },
    {
      day: 'Saturday',
      consamfrom: '',
      consamto: '',
      conspmfrom: '',
      conspmto: '',
    },
    {
      day: 'Sunday',
      consamfrom: '',
      consamto: '',
      conspmfrom: '',
      conspmto: '',
    },
  ];

  constructor(
    public _user: UserService,
    public _ds: DataService,
    public dialog: MatDialog,
    private datepipe: DatePipe,
    private snackbar: MatSnackBar
  ) {}
  otherinfo: any = [];
  classes: any = [];

  
  ngOnInit(): void {

    this.getFacultyClasses();
    this.getTime();
    this.getOtherInfo();
    $('[data-toggle="tooltip"]').tooltip();
  }

  // viewClass(c) { this._user.setSelectedClass(c); }

  formatedate(date) {
    return this.datepipe.transform(new Date(date), 'yyyy-MM-ddTHH:mm:ss.SSS');
  }

  transform(time: any): any {
    let hour = time.split(':')[0];
    let min = time.split(':')[1];
    let part = hour > 12 ? 'pm' : 'am';
    min = (min + '').length == 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour + '').length == 1 ? `0${hour}` : hour;
    return `${hour}:${min} ${part}`;
  }


  getFacultyClasses() {
    let load = {
      data: {
        email: this._user.getUserEmail(),
        acadyear: this._user.getSettings().acadyear_fld,
        semester: this._user.getSettings().sem_fld,
      },
    };
    this._ds._httpRequest('getclasslist', load, 1).subscribe(
      (dt: any) => {
        dt = this._user._decrypt(dt.a);
  
        this.classes = dt.payload;
      },
      (er) => {
        er = this._user._decrypt(er.error.a);
 
      }
    );
  }


  onSubmitExcess(e): void {
    let load: any = {
      data: [],
      email: this._user.getUserEmail()
    };
    for (let i = 0; i < e.target.isexcess_fld.length; i++) {
      if (e.target.isexcess_fld[i].checked) {
        load.data.push({
          isexcess_fld: 1,
          classcode_fld: e.target.isexcess_fld[i].value,
        });
        this.classes[i].isexcess_fld = 1;
      } else {
        load.data.push({
          isexcess_fld: 0,
          classcode_fld: e.target.isexcess_fld[i].value,
        });
        this.classes[i].isexcess_fld = 0
      }
    }


    this._ds._httpRequest('addexcess', load, 1).subscribe(
      (res: any) => {
        res = this._user._decrypt(res.a);
        this.openSnackBar('Record Updated', 1000);
      },
      (er) => {
        er = this._user._decrypt(er.error.a)
        this.openSnackBar('Unable to update record. Please try again', 5000);
      }
    );
  }

  onSubmitOfficialTime(e): void {
    let load = {
      mon_amin: e.target.amin[0].value,
      mon_amout: e.target.amout[0].value,
      mon_pmin: e.target.pmin[0].value,
      mon_pmout: e.target.pmout[0].value,

      tue_amin: e.target.amin[1].value,
      tue_amout: e.target.amout[1].value,
      tue_pmin: e.target.pmin[1].value,
      tue_pmout: e.target.pmout[1].value,

      wed_amin: e.target.amin[2].value,
      wed_amout: e.target.amout[2].value,
      wed_pmin: e.target.pmin[2].value,
      wed_pmout: e.target.pmout[2].value,

      thu_amin: e.target.amin[3].value,
      thu_amout: e.target.amout[3].value,
      thu_pmin: e.target.pmin[3].value,
      thu_pmout: e.target.pmout[3].value,

      fri_amin: e.target.amin[4].value,
      fri_amout: e.target.amout[4].value,
      fri_pmin: e.target.pmin[4].value,
      fri_pmout: e.target.pmout[4].value,

      sat_amin: e.target.amin[5].value,
      sat_amout: e.target.amout[5].value,
      sat_pmin: e.target.pmin[5].value,
      sat_pmout: e.target.pmout[5].value,

      sun_amin: e.target.amin[6].value,
      sun_amout: e.target.amout[6].value,
      sun_pmin: e.target.pmin[6].value,
      sun_pmout: e.target.pmout[6].value,
    };

    this._ds._httpRequest('editpersonneltime', load, 1).subscribe(
      (res: any) => {
        res = this._user._decrypt(res.a);
        this.openSnackBar('Record Updated', 1000);
        this.setTime(res);
      },
      (er) => {
        this.openSnackBar('Unable to update record. Please try again', 5000);
      }
    );

    e.target.camin.forEach((element) => {
      element.checked = false;
    });
    e.target.camout.forEach((element) => {
      element.checked = false;
    });
    e.target.cpmin.forEach((element) => {
      element.checked = false;
    });
    e.target.cpmout.forEach((element) => {
      element.checked = false;
    });
  }

  onSubmitConsultation(e): void {
    // e.preventDefaults();

    let load = {
      mon_consamfrom: e.target.consamfrom[0].value,
      mon_consamto: e.target.consamto[0].value,
      mon_conspmfrom: e.target.conspmfrom[0].value,
      mon_conspmto: e.target.conspmto[0].value,

      tue_consamfrom: e.target.consamfrom[1].value,
      tue_consamto: e.target.consamto[1].value,
      tue_conspmfrom: e.target.conspmfrom[1].value,
      tue_conspmto: e.target.conspmto[1].value,

      wed_consamfrom: e.target.consamfrom[2].value,
      wed_consamto: e.target.consamto[2].value,
      wed_conspmfrom: e.target.conspmfrom[2].value,
      wed_conspmto: e.target.conspmto[2].value,

      thu_consamfrom: e.target.consamfrom[3].value,
      thu_consamto: e.target.consamto[3].value,
      thu_conspmfrom: e.target.conspmfrom[3].value,
      thu_conspmto: e.target.conspmto[3].value,

      fri_consamfrom: e.target.consamfrom[4].value,
      fri_consamto: e.target.consamto[4].value,
      fri_conspmfrom: e.target.conspmfrom[4].value,
      fri_conspmto: e.target.conspmto[4].value,

      sat_consamfrom: e.target.consamfrom[5].value,
      sat_consamto: e.target.consamto[5].value,
      sat_conspmfrom: e.target.conspmfrom[5].value,
      sat_conspmto: e.target.conspmto[5].value,

      sun_consamfrom: e.target.consamfrom[6].value,
      sun_consamto: e.target.consamto[6].value,
      sun_conspmfrom: e.target.conspmfrom[6].value,
      sun_conspmto: e.target.conspmto[6].value,
    };

    this._ds._httpRequest('editpersonneltime', load, 1).subscribe(
      async (res: any) => {
        res = this._user._decrypt(res.a);
        this.openSnackBar('Record Updated', 1000);
        this.setTime(res);
       
      },
      (er) => {
        er = this._user._decrypt(er.error.a);
        this.openSnackBar('Unable to update record. Please try again', 5000);
      }
    );

    e.target.cconsamfrom.forEach((element) => {
      element.checked = false;
    });
    e.target.cconsamto.forEach((element) => {
      element.checked = false;
    });
    e.target.cconspmfrom.forEach((element) => {
      element.cchecked = false;
    });
    e.target.cconspmto.forEach((element) => {
      element.checked = false;
    });
  }

  onSubmitOtherInfo(e: any): void {
    e.preventDefault();
    let load = {
      data: {
        specialization_fld: e.target.specialization_fld.value,
        educ_fld: e.target.educ_fld.value,
        assignment_fld: e.target.assignment_fld.value,
        numpreps_fld: e.target.numpreps_fld.value,
        effectivity_fld: e.target.effectivity_fld.value,
        sex_fld: e.target.sex_fld.value
      },
    };

    
    this._ds
      ._httpRequest('updateprofile/' + this._user.getUserID(), load, 1)
      .subscribe(
        (res: any) => {
          res = this._user._decrypt(res.a);
          this.otherinfo = res.payload[0];
          this.signaturePath = this._ds.imageURL + this.otherinfo.esign_fld + "?v="+Math.random().toString();
          this.openSnackBar('Record Updated', 1000);
        },
        (er) => {
          er = this._user._decrypt(er.error.a);
          this.openSnackBar('Unable to update record. Please try again', 5000);
        }
      );
  }

  getOtherInfo() {
    this._ds
      ._httpRequest('facultyprofile/' + this._user.getUserID(), '', 1)
      .subscribe(
        (res: any) => {
          res = this._user._decrypt(res.a);
          this.otherinfo = res.payload[0];
          if(!this.otherinfo.esign_fld) {
            this.signaturePath='assets/images/noimage.png';
          } else {
            this.signaturePath = this._ds.imageURL + this.otherinfo.esign_fld + "?v="+Math.random().toString();
          }
        },
        (er) => {
          er = this._user._decrypt(er.error.a);
        
        }
      );
  }

  // Get time

  getTime() {
    this._ds._httpRequest('getpersonneltime', '', 1).subscribe(
      (res: any) => {
        res = this._user._decrypt(res.a);
        this.setTime(res);
      },
      (er) => {
        er = this._user._decrypt(er.error.a)
      }
    );
  }






  // Set time on object

  setTime(array) {
    let tmp = array.payload[0];
    
    for(let i = 0; i< this.officialTime.length; i++){
      let day = this.officialTime[i].day.toLowerCase().substring(0, 3);
     
      this.officialTime[i].amin = eval(`tmp.${day}_amin`)
      this.officialTime[i].amout = eval(`tmp.${day}_amout`)
      this.officialTime[i].pmin = eval(`tmp.${day}_pmin`)
      this.officialTime[i].pmout = eval(`tmp.${day}_pmout`)
 
    }

    for(let i = 0; i< this.consultTime.length; i++){
      let day = this.consultTime[i].day.toLowerCase().substring(0, 3);
      this.consultTime[i].consamfrom = eval(`tmp.${day}_consamfrom`)
      this.consultTime[i].consamto = eval(`tmp.${day}_consamto`)
      this.consultTime[i].conspmfrom = eval(`tmp.${day}_conspmfrom`)
      this.consultTime[i].conspmto = eval(`tmp.${day}_conspmto`)
      
    }

    // this.officialTime[0].amin = tmp.mon_amin;
    // this.officialTime[0].amout = tmp.mon_amout;
    // this.officialTime[0].pmin = tmp.mon_pmin;
    // this.officialTime[0].pmout = tmp.mon_pmout;

    // this.officialTime[1].amin = tmp.tue_amin;
    // this.officialTime[1].amout = tmp.tue_amout;
    // this.officialTime[1].pmin = tmp.tue_pmin;
    // this.officialTime[1].pmout = tmp.tue_pmout;

    // this.officialTime[2].amin = tmp.wed_amin;
    // this.officialTime[2].amout = tmp.wed_amout;
    // this.officialTime[2].pmin = tmp.wed_pmin;
    // this.officialTime[2].pmout = tmp.wed_pmout;

    // this.officialTime[3].amin = tmp.thu_amin;
    // this.officialTime[3].amout = tmp.thu_amout;
    // this.officialTime[3].pmin = tmp.thu_pmin;
    // this.officialTime[3].pmout = tmp.thu_pmout;

    // this.officialTime[4].amin = tmp.fri_amin;
    // this.officialTime[4].amout = tmp.fri_amout;
    // this.officialTime[4].pmin = tmp.fri_pmin;
    // this.officialTime[4].pmout = tmp.fri_pmout;

    // this.officialTime[5].amin = tmp.sat_amin;
    // this.officialTime[5].amout = tmp.sat_amout;
    // this.officialTime[5].pmin = tmp.sat_pmin;
    // this.officialTime[5].pmout = tmp.sat_pmout;

    // this.officialTime[6].amin = tmp.sun_amin;
    // this.officialTime[6].amout = tmp.sun_amout;
    // this.officialTime[6].pmin = tmp.sun_pmin;
    // this.officialTime[6].pmout = tmp.sun_pmout;

    // this.consultTime[0].consamfrom = tmp.mon_consamfrom;
    // this.consultTime[0].consamto = tmp.mon_consamto;
    // this.consultTime[0].conspmfrom = tmp.mon_conspmfrom;
    // this.consultTime[0].conspmto = tmp.mon_conspmto;

    // this.consultTime[1].consamfrom = tmp.tue_consamfrom;
    // this.consultTime[1].consamto = tmp.tue_consamto;
    // this.consultTime[1].conspmfrom = tmp.tue_conspmfrom;
    // this.consultTime[1].conspmto = tmp.tue_conspmto;

    // this.consultTime[2].consamfrom = tmp.wed_consamfrom;
    // this.consultTime[2].consamto = tmp.wed_consamto;
    // this.consultTime[2].conspmfrom = tmp.wed_conspmfrom;
    // this.consultTime[2].conspmto = tmp.wed_conspmto;

    // this.consultTime[3].consamfrom = tmp.thu_consamfrom;
    // this.consultTime[3].consamto = tmp.thu_consamto;
    // this.consultTime[3].conspmfrom = tmp.thu_conspmfrom;
    // this.consultTime[3].conspmto = tmp.thu_conspmto;

    // this.consultTime[4].consamfrom = tmp.fri_consamfrom;
    // this.consultTime[4].consamto = tmp.fri_consamto;
    // this.consultTime[4].conspmfrom = tmp.fri_conspmfrom;
    // this.consultTime[4].conspmto = tmp.fri_conspmto;

    // this.consultTime[5].consamfrom = tmp.sat_consamfrom;
    // this.consultTime[5].consamto = tmp.sat_consamto;
    // this.consultTime[5].conspmfrom = tmp.sat_conspmfrom;
    // this.consultTime[5].conspmto = tmp.sat_conspmto;

    // this.consultTime[6].consamfrom = tmp.sun_consamfrom;
    // this.consultTime[6].consamto = tmp.sun_consamto;
    // this.consultTime[6].conspmfrom = tmp.sun_conspmfrom;
    // this.consultTime[6].conspmto = tmp.sun_conspmto;

  }

  status(value) {
    if (value == 'Online') {
      return '#2ed573';
    } else {
      return 'Crimson';
    }
  }

  printIFL(empcode): void {
    let filler = new KeyImage();
    window.open(this._ds.imageURL+"printables/ifl.php?emp="+filler.generateASCIIString(10)+btoa(empcode).replace(/=/g, "")+filler.generateHexString(3));
  }

  uploadSign(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "40vw";
    dialogConfig.data = {
      load: null,
      type: 'signature'
    }
    const updatePicture = this.dialog.open(UpdateProfilePictureComponent, dialogConfig);
    updatePicture.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.getOtherInfo();
        this.openSnackBar("Signature Uploaded", 1000);
        this.signaturePath = this._ds.imageURL + 'gcesuploads/'+ this._user.getUserID() + '/Signature.png?v='+Math.random().toString();
      }
      
    })
  }

  openSnackBar(msg, duration) {
    this.snackbar.open(msg, 'Dismiss', { duration, horizontalPosition: 'center', verticalPosition: 'bottom'});
  }
  
}
