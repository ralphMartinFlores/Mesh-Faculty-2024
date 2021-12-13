import { Injectable } from '@angular/core';
import { AppConfig } from './data.schema';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService extends AppConfig{

  constructor(private http: HttpClient) { 
    super()
  }

  load(){
    return this.http.get<AppConfig>('assets/app.config.json')
    .toPromise().then(data=>{
      this.baseURL = data.baseURL
      this.downloadURL = data.downloadURL
      this.imgURL = data.imgURL
      this.prefix = data.prefix
    })
  }
}
