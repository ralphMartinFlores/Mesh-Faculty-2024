import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  textcontent: any;
  newpass = '';


  constructor(private _ds: DataService, public _user:UserService, @Inject(MAT_DIALOG_DATA) public data: any, private dialogReg: MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    if (this.data.newpw == undefined || this.data.newpw == null) {
      return
    }else{
      this.newpass = this.data.newpw;
    }

    if (this.data.data == undefined || this.data.data.content_fld == undefined || this.data.data.content_fld == null) {
      return;
    }else{
      this.textcontent = this.data.data.content_fld;      
    }
  }
  
  condel(v: number) { this.dialogReg.close({ data: v }); }
  editcomment(v: number) { this.dialogReg.close({ data: this.textcontent  }); }
  turnin(v: number) { this.dialogReg.close({ data: v }); }
  unsubmit(v: number) { this.dialogReg.close({ data: v }); }
  getFilename(data) { return data.replace(/^.*[\\\/]/, ''); }
  returnFileUrl(path) { return this._ds.baseURL + path }

  logout(v: number){
    this.dialogReg.close({data:v});    
  }

  quizSubmit(v:number){
    this.dialogReg.close({data:v});
  }

  confirmRedeem(){
    this.dialogReg.close({data:true})
  }


}
