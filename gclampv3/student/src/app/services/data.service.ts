import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from './data-schema';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  public prefix: string = 'GC'; 
  public baseURL: string = 'http://localhost/GC-LAMP-Faculty/api/student/';
  public nodeBaseURL: string = 'http://localhost:4230/api/' // NODE
  public fileUrl: string = 'http://localhost/GC-LAMP-Faculty/api/';
  public imageURL: string = 'http://localhost/GC-LAMP-Faculty/requests/';
  // public booksURL: string = 'http://localhost/LAMP/documents/books/'
  // Staging
  // public prefix: string; 
  public booksURL: string = "https://gordoncollegeccs.edu.ph/downloads/books/"
 


  constructor(private _http: HttpClient, private _user: UserService, cfg: AppConfig) {
    this.baseURL = cfg.baseURL
    this.fileUrl = cfg.fileUrl
    this.prefix = cfg.prefix
    this.imageURL = cfg.imgURL
   }

  _httpRequest(api: string, load: any, sw: number) {
    console.log(this.baseURL)
    let userDevice: string = this._user.isMobile() ? 'Web Access using Mobile phone' : 'Web Access using Desktop/Laptop';

    let result: any;
    switch (sw) {
      case 1:
        let dt = {
          payload: load,
          param1: this._user.getUserID(),
          param2: this._user.getToken(),
          param3: 1,
          param4: userDevice,
          param5: this._user.getRole(),
          param6: this._user.getFullname(),
          param7: this._user.getDepartment(),
          param8: this._user.getProgram()
        };
        result = this._http.post(this.baseURL + api, JSON.stringify(dt));
        break;
      case 2:
        result = this._http.post(this.baseURL + api, JSON.stringify(load));
        break;
      case 3:
        let d = {
          param1: this._user.getUserID(),
          param2: this._user.getToken(),
          param3: 1,
          param4: userDevice,
          param5: this._user.getRole(),
          param6: this._user.getFullname(),
          param7: this._user.getDepartment(),
          param8: this._user.getProgram()
        };

        load.append('auth', JSON.stringify(d));
        result = this._http.post(this.baseURL + api, load);
        break;
      case 4:
        result = this._http.post(this.baseURL + api, (JSON.stringify(load)));
        break;
      // Papalitan ni louds
      case 5:
        result = this._http.post(this.fileUrl + api, unescape(encodeURIComponent(JSON.stringify(load))));
        break;
      default: break;
    }


    return result;
  }

  downloadFile(filepath, filename) {

    let userDevice: string = this._user.isMobile() ? 'Web Access using Mobile phone' : 'Web Access using Desktop/Laptop';

    let dt = {
      payload: { filepath: filepath, filename: filename },
      param1: this._user.getUserID(),
      param2: this._user.getToken(),
      param3: 1,
      param4: userDevice,
      param5: this._user.getRole(),
      param6: this._user.getFullname(),
      param7: this._user.getDepartment(),
      param8: this._user.getProgram()
    };

    this._http.post(this.baseURL + btoa('download'), this._user._convertmessage(JSON.stringify(dt)), { responseType: 'blob' }).subscribe((res) => {
      const url = URL.createObjectURL(res);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
    }, er => {

    })

  }
}
