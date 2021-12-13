import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from './data.schema';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  // public baseURL: string;
  // public downloadURL: string;
  // public prefix: string;
  constructor(private _http: HttpClient, private _user: UserService, private appcfg: AppConfig) { 
    // this.prefix = appcfg.prefix
    // this.baseURL = appcfg.baseURL
    // this.downloadURL = appcfg.downloadURL
    // this.imageURL = appcfg.imgURL
  }

  // Development Testing:
  public prefix: string  = 'GC'
  public baseURL: string = 'http://localhost/LAMP/api/faculty/'
  public downloadURL: string = 'http://localhost/LAMP/api/'
  public imageURL: string= 'http://localhost/LAMP/requests/'

  // public baseURL: string = 'https://gordoncollegeccs.edu.ph/lampapi/faculty/';
  // public downloadURL: string = 'https://gordoncollegeccs.edu.ph/lampapi/';
  // public imageURL: string = 'https://gordoncollegeccs.edu.ph/requests/';
  
  
  _httpRequest(api: string, load: any, sw: number) {
    let userDevice: string = this._user.isMobile() ? 'Web Access using Mobile phone' : 'Web Access using Desktop/Laptop';

    let result: any;
    switch (sw) {
      case 1:
        let dt = {
          payload: load,
          param1: this._user.getUserID(),
          param2: this._user.getUserKey(),
          param3: 5,
          param4: userDevice,
          param5: this._user.getUserRole(),
          param6: this._user.getUserFullname(),
          param7: this._user.getUserDept(),
          param8: this._user.getUserProgram()
        };
        result = this._http.post(this.baseURL + btoa(api), this._user._convertmessage(((JSON.stringify(dt)))));
        break;
      case 2:
        result = this._http.post(this.baseURL + btoa(api), this._user._convertmessage(((JSON.stringify(load)))));
        break;
      case 3:
        let d = {
          param1: this._user.getUserID(),
          param2: this._user.getUserKey(),
          param3: 5,
          param4: userDevice,
          param5: this._user.getUserRole(),
          param6: this._user.getUserFullname(),
          param7: this._user.getUserDept(),
          param8: this._user.getUserProgram()
        };

        load.append('auth', JSON.stringify(d));
        result = this._http.post(this.baseURL + btoa(api), load);
        break;

      case 4:
        // result = this._http.post(this.baseURL + btoa(api), this._user._convertmessage((decodeURIComponent(JSON.stringify(dt)))));
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
      param2: this._user.getUserKey(),
      param3: 5,
      param4: userDevice,
      param5: this._user.getUserRole(),
      param6: this._user.getUserFullname(),
      param7: this._user.getUserDept(),
      param8: this._user.getUserProgram()
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
