import { Injectable } from '@angular/core';
import { AppConfig } from './data-schema';
import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class ConfigService extends AppConfig {

  constructor(private http: HttpClient) { 
    super()
  }

  load(){
    return this.http.get<AppConfig>('assets/app.config.json')
    .toPromise()
    .then(data=>{
      this.baseURL = data.baseURL
      this.fileUrl = data.fileUrl
      this.prefix = data.prefix,
      this.imgURL = data.imgURL
    })
    .catch(()=>{
      console.error("Could not find load configuration")
    })
  }
}
