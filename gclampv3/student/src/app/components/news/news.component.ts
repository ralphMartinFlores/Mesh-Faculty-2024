import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { staggereffect } from '../class/animation';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { UploadsService } from 'src/app/services/uploads.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  animations: [
    staggereffect
  ]
})
export class NewsComponent implements OnInit {
  image: any;
  latestimg: any;
  filter: string;
  allnews: any = [];
  latestreset: any = [];

  constructor(public _upload:UploadsService,private _router: Router, public _ds: DataService, public _user: UserService) { }

  newsdata=[1,2,3,4,5,6];
  announcements = [];
  latest = [];
  showLoader: boolean = true;

  ngOnInit(): void {
    this.getAnnouncement();
  }

  viewContent() {
    this._router.navigate(['./main/news/',21]);
  }

  getAnnouncement() {
    this._ds._httpRequest('getannounce', { dept: this._user.getDepartment(), program: this._user.getProgram() }, 1).subscribe((data: any) => {
      data = this._user._decrypt(data.a);

        this.announcements = data.payload;
        
        this.allnews = data.payload;
        this.latest = data.payload[0];
        this.latestreset = data.payload[0];      
        this.showLoader = false;
     
    },er => {
      er = this._user._decrypt(er.error.a);
      this.showLoader = false;
      
    })
  }

  viewAnnouncement(i) {
    let a = JSON.stringify([this.announcements[i]]);
    this._user.setContentNews(a);
    this._router.navigate(['./main/news', this.announcements[i].announcecode_fld]);
  }

  filterlist(){
    let results: any = []    
    if(this.filter != ''){
      this.allnews.forEach(index => {      
        if(index.title_fld.toLowerCase().includes(this.filter.toLowerCase()) || index.content_fld.toLowerCase().includes(this.filter.toLowerCase())){
          results.push(index);         
        }
      })      
      this.announcements = results;            
      this.latest = [];      
    } else {      
      this.announcements = this.allnews;      
      this.latest = this.latestreset;
    }
  }

}
