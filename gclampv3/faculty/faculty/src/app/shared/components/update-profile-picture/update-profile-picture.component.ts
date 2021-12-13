import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-update-profile-picture',
  templateUrl: './update-profile-picture.component.html',
  styleUrls: ['./update-profile-picture.component.scss']
})
export class UpdateProfilePictureComponent implements OnInit {

  imageUrl: ArrayBuffer | string = this._ds.downloadURL + this._user.getUserImage();
  files: any = [];
  filepath: string;
  base64Image: string = null;
  croppedImage: string = null;
  orientation: any;
  pictureType = "profile";

  constructor(
    public _user: UserService,
    public _ds: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogReg: MatDialogRef<UpdateProfilePictureComponent>,
    private _imageCompress: NgxImageCompressService,
  ) { }


  ngOnInit(): void {
    this.pictureType = this.data.type;
   }

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
      this._ds._httpRequest('uploadpic/profile/' + this._user.getUserID(), imgData, 3).subscribe(async (data: any) => {
        data = await this._user._decrypt(data.a);
        let load = {
          data: {
            image_fld: data.payload.filepath
          },
          notif: {
            id: this._user.getUserID(),
            recipient: this._user.getUserID(),
            message: this._user.getUserFullname() + ' Profile picture update.',
            module: 'Profile Component'
          }
        }
        this._ds._httpRequest('updateprofile/' + this._user.getUserID(), load, 1).subscribe((dt: any) => {
          dt = this._user._decrypt(dt.a);
          this._user.updateUserData({ img: dt.payload[0].image_fld + "?e=" + Math.random().toString() });
          this.dialogReg.close();
          this._user.setLoading(false);
        }, err => {
          err = this._user._decrypt(err.error.a);
          this._user.setLoading(false);
          throw err;
        });
      });
    });
  }

  async updateSignature() {
    this._user.setLoading(true);
    this._imageCompress.compressFile(this.croppedImage, this.orientation, 100, 100).then(res => {
      let imgData = new FormData();
      let img: string;
      let imgToUpload: File;
      img = res;
      imgToUpload = this.convertToBlob(img)
      imgData.append('file[]', imgToUpload);
      this._ds._httpRequest('uploadpic/signature/' + this._user.getUserID(), imgData, 3).subscribe(async (data: any) => {
        data = await this._user._decrypt(data.a);
        let load = {
          data: {
            esign_fld: data.payload.filepath
          },
          notif: {
            id: this._user.getUserID(),
            recipient: this._user.getUserID(),
            message: this._user.getUserFullname() + ' Signature update.',
            module: 'Faculty Loading Component'
          }
        }
        this._ds._httpRequest('updateprofile/' + this._user.getUserID(), load, 1).subscribe((dt: any) => {
          dt = this._user._decrypt(dt.a);
        
          // this._user.updateUserData({ img: dt.payload[0].image_fld + "?e=" + Math.random().toString() });
          this.dialogReg.close(load.data);
          this._user.setLoading(false);
        }, err => {
          err = this._user._decrypt(err.error.a);
          console.log(err)
          this._user.setLoading(false);
        });
      });
    });
  }
}
