import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-update-profile-modal',
  templateUrl: './update-profile-modal.component.html',
  styleUrls: ['./update-profile-modal.component.scss']
})
export class UpdateProfileModalComponent implements OnInit {
  region: any = [];
  province: any = [];
  city: any = [];
  brgy: any;

  constructor(public _user: UserService, private _ds: DataService,@Inject(MAT_DIALOG_DATA) public data: any, private dialogReg: MatDialogRef<DialogComponent>) { }

  student;
  regCode;

  ngOnInit(): void {
    this.getStudentInfo()
    this.initializeAddress()
  }

  initializeAddress(){
    this.getRegion();
    // this.displayProvince();
  }

  getStudentInfo() {
    this._ds._httpRequest('studentprofile', {userid:this._user.getUserID()}, 1).subscribe((dt: any) => {
      dt = this._user._decrypt(dt.a);
      this._user.setStudentProfile(dt.payload);
      this.student = dt.payload;
      
    },er=>{
      er = this._user._decrypt(er.error.a);
    });
  }

  getRegion(){
    this._ds._httpRequest('getRegion',{},1).subscribe((data:any) => {
      data = this._user._decrypt(data.a);
      this.region = data.payload;
    },
    er=>{
      er = this._user._decrypt(er.error.a)
      console.error(er)
    })
  }

  closeDialog(data) {
    this.dialogReg.close(data);
  }

  getProvince(e){
    this._ds._httpRequest('getProvince',{region_id:e.target.value},1).subscribe((data:any) => {
      data = this._user._decrypt(data.a);
      this.province = data.payload;
      for(let i = 0; i < this.province.length; i++) {
        if(this.province[i].regCode != e.target.value){
          this.province.splice(i,1);
          i--;
        }   
      }
      this.province.sort(function(a, b){    
      return a.provDesc.localeCompare(b.provDesc)        
      })   
      
    })
  }

  getCity(e){    
    this._ds._httpRequest('getCity',{province_id:e.target.value},1).subscribe((data:any) => {
      data = this._user._decrypt(data.a);
      this.city = data.payload;
      for(let i = 0; i < this.city.length; i++) {
        if(this.city[i].provCode != e.target.value){
          this.city.splice(i,1);
          i--;
        }   
      }
      this.city.sort(function(a,b){
        return a.citymunDesc.localeCompare(b.citymunDesc);
      })
    })
  }

  getBrgy(e){    
    this._ds._httpRequest('getBrgy',{municipality_id:e.target.value},1).subscribe((data:any) => {
      data = this._user._decrypt(data.a);
      this.brgy = data.payload;
      for(let i = 0; i < this.city.length; i++) {
        if(this.brgy[i].citymunCode != e.target.value){
          this.brgy.splice(i,1);
          i--;
        }   
      }
      this.brgy.sort(function(a,b){
        return a.brgyDesc.localeCompare(b.brgyDesc);
      })
    })
  }

  updateProfile(e){
    e.preventDefault();
    let mname_fld = e.target[1].value;
    let extname_fld = e.target[3].value;
    let birthplace_fld = e.target[5].value;
    let sex_fld = e.target[6].value;
    let civilstatus_fld = e.target[7].value;
    let contactnum_fld = e.target[8].value;
    let nationality_fld = e.target[9].value;
    let religion_fld = e.target[10].value;
    let region_fld = e.target[11].value;
    let province_fld = e.target[12].value;
    let city_fld = e.target[13].value;
    let brgy_fld = e.target[14].value;
    let house_fld = e.target[15].value;
    let zipcode_fld = e.target[16].value;

    let load = {
      data:{
        mname_fld:mname_fld,
        extname_fld:extname_fld,
        birthplace_fld:birthplace_fld,
        sex_fld:sex_fld,
        civilstatus_fld:civilstatus_fld,
        contactnum_fld:contactnum_fld,
        nationality_fld:nationality_fld,
        religion_fld:religion_fld,
        region_fld:region_fld,
        province_fld:province_fld,
        city_fld:city_fld,
        brgy_fld:brgy_fld,
        house_fld:house_fld,
        zipcode_fld:zipcode_fld
      },
      notif:{
        id:this._user.getUserID(),
        recipient: this._user.getUserID(),
        message: this._user.getFullname()+' updated profile ',
        module: 'profile'
      }
      
    }
    this.dialogReg.close({
      data : load
 
    });
    // console.log(load);

    
  }



}
