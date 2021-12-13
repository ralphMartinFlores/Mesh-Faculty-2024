import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-addstudent',
  templateUrl: './addstudent.component.html',
  styleUrls: ['./addstudent.component.scss']
})
export class AddstudentComponent implements OnInit {

  checked = false;
  studentlist = [];

  studentinfo = [];
  constructor(private dialogReg: MatDialogRef<AddstudentComponent>,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public _ds: DataService,
    public _user: UserService,
    @Inject(MAT_DIALOG_DATA) public data,
  ) { }

  ngOnInit(): void { }
  search(e) {
    e.preventDefault();
    let f = e.target.elements;
    this._ds._httpRequest('studentprofile/' + f.id.value, null, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this.studentinfo = dt.payload;
      this._user.openSnackBar(dt.status.message, null, 2000);
      f.id.value = null;
    }, err => {
      err = this._user._decrypt(err.error.a);
      this._user.openSnackBar(err.status.message, null, 2000);
    });
  }


  addtolist(data, i) {
    if (this.duplicateChecker(data)) {
      this._user.openSnackBar("This student is already enrolled in this course.", null, 4000);
    } else if (this.duplicateChecker(data) == false) {
      this.studentlist.push(data);
      this.studentinfo.splice(i, 1);
    }
  }

  duplicateChecker(data) {
    var matched = [];
    this.data.map(e => {
      if (e.studnum_fld == data.studnum_fld) {
        matched.push(true);
      } else {
        matched.push(false);
      }
    });
    return matched.includes(true) ? true : false;
  }

  remove(i) {
    this.studentlist.splice(i, 1);
  }
  removequery(i) {
    this.studentinfo.splice(i, 1);
  }

  addStudents() {
    let load = {};
    this.studentlist.map((e) => {
      load = {
        data: {
          studnum_fld: e.studnum_fld,
          classcode_fld: this._user.getClassroomInfo().classcode_fld,
          subjcode_fld: this._user.getClassroomInfo().subjcode_fld,
          block_fld: this._user.getClassroomInfo().block_fld,
          ay_fld: this._user.getSettings().acadyear_fld,
          sem_fld: this._user.getSettings().sem_fld,
        }
      }

      this._ds._httpRequest('addstudent', load, 1).subscribe((dt: any) => {
        dt = this._user._decrypt(dt.a);
        this.closeDialog(dt.payload.student)
      });
    })
  }

  closeDialog(data) {
    this.dialogReg.close(data);
  }

}
