import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(public _ds: DataService, public _user: UserService) { }

  // @param1 API end point:
  // @param2 payload to be send in API:
  // @param3 http request settings
  async commonSubscribe(endpoint, payload, httpsettings) {
    return new Promise((resolved, rejects) => {
      this._ds._httpRequest(endpoint, payload, httpsettings).subscribe(async (dt: any) => {
        resolved(dt = await this._user._decrypt(dt.a));
      }, er => {
        rejects(er = this._user._decrypt(er.error.a));
      });
    });
  }
}
