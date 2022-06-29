import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-change-profile-picture',
  templateUrl: './change-profile-picture.component.html',
  styleUrls: ['./change-profile-picture.component.scss']
})
export class ChangeProfilePictureComponent implements OnInit {

  files: any = [];
  filepath: string;
  message: string = "Only accepts png file.";
  orientation: any;
  base64Image: string = null;
  croppedImage: string = null;

  constructor(
    private _snackbar: MatSnackBar,
    public _ds: DataService,
    public _user: UserService, @Inject(MAT_DIALOG_DATA)
    public data: any,
    private dialogReg: MatDialogRef<ChangeProfilePictureComponent>,
    private _imageCompress: NgxImageCompressService
  ) { }
  imageUrl: string | ArrayBuffer = this._ds.fileUrl + this._user.getProfilePicture();

  ngOnInit(): void { }

  compressFile() {
    this._imageCompress.uploadFile().then(({ image, orientation }) => {
      this.base64Image = image;
      this.orientation = orientation;
    });
  }

  imageCropped(e: ImageCroppedEvent) {
    this.croppedImage = e.base64;
  }

  convertToBlob(e) {
    let arr = e.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], 'Profile.png', { type: mime });
  }

  async updateProfile() {
    this._user.setLoading(true);
    this._imageCompress.compressFile(this.croppedImage, this.orientation, 50, 100).then(res => {
      let imgData = new FormData();
      let img: string;
      let imgToUpload: File;
      img = res;
      imgToUpload = this.convertToBlob(img)
      imgData.append('file[]', imgToUpload);
      this._ds._httpRequest('editProfile/' + this._user.getUserID(), imgData, 3).subscribe(async (data: any) => {
        data = await this._user._decrypt(data.a);
        let load = {
          data: {
            profilepic_fld: data.payload.filepath
          },
          notif: {
            id: this._user.getUserID(),
            recipient: this._user.getUserID(),
            message: this._user.getFullname() + ' profile picture update.',
            module: 'profile'
          }
        }
        this._ds._httpRequest('updateprofile/' + this._user.getUserID(), load, 1).subscribe((data: any) => {
          data = this._user._decrypt(data.a);
          this._user.setLoading(false);
          this._user.updateUserData({ img: data.payload[0].profilepic_fld + "?e=" + Math.random().toString() },'studentuser');
          this.dialogReg.close();
        });
      });
    });
  }

}
