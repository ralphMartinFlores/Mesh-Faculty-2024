import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from './data.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'

})
export class UploadingService {
  public files: any = [];

  public filepath = [];

  constructor(private _ds: DataService, 
    private _user: UserService,
    public sanitizer: DomSanitizer) { }

  formAppending(files) {
    const formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      formData.append('file[]', files[i]);
    }
    formData.append('payload', JSON.stringify(files));
    return formData;
  }

  async uploadFiles(files: any) {
    if (files.length == 0) return null;
    let formdata: FormData;
    formdata = this.formAppending(files);
    return new Promise((resolve, rejects) => {
      this._ds._httpRequest('upload/' + this._user.getUserID(), formdata, 3).subscribe((data: any) => {
        data = this._user._decrypt(data.a);
        this.filepath = [];
        this.files = [];
        resolve(data.payload.filepath);
      }, er => {
        rejects(er.error.error.message);
      });
    })
  }


  getFilePreview(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      this.files.push(event.target.files[i]);
    }
    // let files = event.target.files;
    // if (files) {
    //   for (let file of files) {
    //     let reader = new FileReader();
    //     reader.onload = (e: any) => {
    //       this.previewFiles.push(e.target.result);

    //       console.log(this.previewFiles);
    //     }
    //     reader.readAsDataURL(file);
    //   }
    // }

    return this.files;

  }

  splitFilestring(filestring: string) {
    let filearray: { name: string; link: string; path: string, extension: any, sanitizedPath: any }[] = [];
    let arr1 = filestring.split(':');
    for (let i = 0; i < arr1.length; i++) {
      let arr2 = arr1[i].split('?');
      filearray.push({ name: arr2[0], link: this._ds.downloadURL + arr2[1], path: arr2[1], extension: /[^.]+$/.exec(arr2[0]), sanitizedPath:  this.sanitizer.bypassSecurityTrustResourceUrl(this._ds.downloadURL + arr2[1])});
    }
    return filearray;

  }

  splitPollContent(pollcontent: any) {
    let contentvalue = pollcontent.content_fld.split('($)');
    let pollOpt: any = contentvalue[1];
    pollOpt = pollOpt.split('(*)');
    return { content_fld: contentvalue[0], pollchoices_fld: pollOpt };
  }


  getfileExt(filename) {
    return filename.split('.').pop();
  }



}
