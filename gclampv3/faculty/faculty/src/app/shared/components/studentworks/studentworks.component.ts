import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-studentworks',
  templateUrl: './studentworks.component.html',
  styleUrls: ['./studentworks.component.scss']
})
export class StudentworksComponent implements OnInit {
  filter: any = 0;
  assigned: boolean;
  default = "allworks";
  studentworks: object;
  filteredObj: any = [];
  constructor(
    private dialogReg: MatDialogRef<StudentworksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _user: UserService,
    private _ds: DataService,
  ) { }

  ngOnInit(): void {
    if (!('activity' in this.data.data)) return;
    this.activityFilter();
    this.filterByKeys({ value: 'allworks' });
  }

  activityFilter() {
    let studentworks = {
      lateworks: [],
      missingworks: [],
      turnedinworks: [],
      allworks: [],
    }

    this.data.data.activity.map((e: any) => {
      studentworks.allworks.push(e);
      if (e.issubmitted_fld == 0) {
        studentworks.missingworks.push(e);
      }
      if (e.issubmitted_fld == 1 || e.issubmitted_fld == 2) {
        studentworks.turnedinworks.push(e);
      }
      if (e.issubmitted_fld == 2) {
        studentworks.lateworks.push(e);
      }
    });
    this.studentworks = studentworks;


  }

  filterByKeys(filterkey) {
    const filter = Object.keys(this.studentworks)
      .filter(key => filterkey.value.includes(key))
      .reduce((obj, key) => {
        obj[key] = this.studentworks[key];
        return obj;
      }, {});
    this.filteredObj = filter[filterkey.value];
  }
}
