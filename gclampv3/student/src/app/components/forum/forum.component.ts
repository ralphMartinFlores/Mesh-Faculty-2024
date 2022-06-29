import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { staggereffect } from '../class/animation';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss'],
  animations: [
    staggereffect
  ]
})
export class ForumComponent implements OnInit {
  forumsdata: any = [];
  showLoader: boolean = true;
  filter: string = '';
  allforum: any = [];

  constructor(private router: Router, public _user:UserService, public _ds:DataService) { }


  ngOnInit(): void {
    this.getTopics();
  }

  getTopics(){
    this._ds._httpRequest('getforumtopic',null,1).subscribe((data:any)=>{
      data = this._user._decrypt(data.a);
      this.forumsdata = data.payload;
      this.allforum = data.payload;
      this._user.setMainForums(this.forumsdata);
      // console.log(this.forumsdata);
      this.showLoader = false;
      
    },er => {
      er = this._user._decrypt(er.error.a);
      this.forumsdata = [];
      this.allforum = [];
      this.showLoader = false;
      // console.log(er);
      
    })
  }

  filterlist(){
    let results: any = []    
    if(this.filter != ''){
      this.allforum.forEach(index => {
        if(index.forumtitle_fld.toLowerCase().includes(this.filter.toLowerCase())||index.forumdesc_fld.toLowerCase().includes(this.filter.toLowerCase())){
          results.push(index);
          // console.log(results);
          
        }
      })
      this.forumsdata = results;      
    } else {      
      this.forumsdata = this.allforum;
    }
  }


}
