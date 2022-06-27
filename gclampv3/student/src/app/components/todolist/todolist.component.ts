import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.scss']
})
export class TodolistComponent implements OnInit {
  list: any = [];
  tasklist: any=[];
  classArr:any = [];
  showLoader: boolean = true;
  showTable = false;
  subObj: any = []

  constructor(public _user:UserService, public _ds:DataService,private _router:Router,) { }

  ngOnInit(): void {
    this.classArr = this._user.getStudentSchedule();
    this.getlist();     
  }
  
  ngAfterViewInit(): void{
    console.clear()
  }

  date_diff_indays(date1, date2) {
    var dt1 = new Date(date1);
    var dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
  }



  showName(){
    if(this._user.getLoginState()){
      return this._user.getFullname();
    }
  }  

  getlist(){
    this._ds._httpRequest(`gettodolist/${this._user.getSettings().acadyear_fld}/${this._user.getSettings().sem_fld}`,{param1:this._user.getUserID()},1).subscribe( async (data:any)=>{
      data = this._user._decrypt(data.a);   
      this.subObj = await data.payload.sub 
      this.list = await this.getTodoList(data.payload.class, data.payload.act);

      this.showLoader = false;
    }, er => {
      
      er = this._user._decrypt(er.error.a);
      this.list = [];
      this.showLoader = false;
      
      
    });  
  }

  isShowTodoList(li){
    let actCount = 0;
    let doneCount = 0;
    for (let i = 0; i < li.length; i++) {
      actCount += li[i].activity.length
      doneCount += li[i].done_count
    }

    if(actCount== doneCount){
    // console.log(actCount);

      return true
    }

    return false;

  }

  viewActivity(classcode){
    // console.log(this.classArr,classcode);
    for (let i = 0; i < this.classArr.length; i++) {
      if (this.classArr[i].classcode_fld === classcode) {
        this._user.setSelectedClass(this.classArr[i]);
        
      }
      
    }
  }

  getTodoList(sClass, sActivity){
    let todoObj: any = []
    sClass.forEach(element=>{
      todoObj.push({
        classcode: element.classcode_fld,
        subjdesc: element.subjdesc_fld,
        activity: this.getClassActivity(element.classcode_fld, sActivity)
      })
    })
    return todoObj
  }

  getClassActivity(classcode, actobj){
    let actList: any
    
    let arr: any = actobj.filter(item =>
      (classcode == item.classcode_fld)
    )

    arr.forEach( (element, i) => {
      let submit = this.subObj
      .find( (item: any ) => {
        return item.actcode_fld == element.actcode_fld && item.classcode_fld == classcode    
      })
      if(arr[i]!=undefined){
        if(submit!=undefined){
          arr[i] = {
            ...arr[i], ...submit
          }
         
        }
      }
    });
   
    
  
  
    return arr
  }

}
