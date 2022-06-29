import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-change-pass-modal',
  templateUrl: './change-pass-modal.component.html',
  styleUrls: ['./change-pass-modal.component.scss']
})
export class ChangePassModalComponent implements OnInit {

  hide: boolean;
  newpasshide:boolean;
  newpasshide2:boolean;

  constructor(public _ds:DataService, public _user: UserService,@Inject(MAT_DIALOG_DATA) public data: any,private dialogReg: MatDialogRef<DialogComponent>,private _snackbar:MatSnackBar) { }

  ngOnInit(): void {
    
  }

  changePass(e){
    e.preventDefault();
    let id = e.target[0].value;
    let oldPass = e.target[1].value;
    let newPass = e.target[2].value;
    let confirmPass = e.target[3].value;

    // console.log(oldPass,newPass,confirmPass);

    var hasUpperCase = /[A-Z]/.test(newPass);
    var hasLowerCase = /[a-z]/.test(newPass);
    var hasNumbers = /\d/.test(newPass);
    // var hasNonalphas = /\W/.test(newPass);
     
    if (hasUpperCase == true && hasLowerCase == true && hasNumbers == true && newPass.length >= 8) {
      if (newPass == confirmPass) {

      
        this._ds._httpRequest('changepass' ,{ id: id,param1: oldPass,param2: newPass,param3: confirmPass }, 1).subscribe((dt: any)=>{
          dt = this._user._decrypt(dt.a)
          this._snackbar.open("Password change successfully",null,{duration:1500});
          this.closeDialog(true);
              
          },er=>{
            er = this._user._decrypt(er.error.a);
            console.log(er)
            this._snackbar.open("Failed to update password",null,{duration:1500});

          })
        
      }else{
        this._snackbar.open('Password Mismatch.', "", {duration:1500});
        // console.log("Mismatch password");
        
      }
      
    }else{
      this._snackbar.open('Your password is too weak.', "", {duration:1500});
      // console.log("Password too weak");
      
    }
  }

  closeDialog(data = false) {
    this.dialogReg.close();
  }

}
