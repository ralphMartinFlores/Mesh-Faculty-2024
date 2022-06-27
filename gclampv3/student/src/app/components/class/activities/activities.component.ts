import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { ResourcePreviewComponent } from 'src/app/shared/resource-preview/resource-preview.component';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { UploadsService } from 'src/app/services/uploads.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  activities:any[] = [];
  resources:any[] = [];
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  topicObj: any = [];
  activityObject: any = [];
  constructor(
    public uploadservice: UploadsService,
    public _ds:DataService ,
     public _user:UserService, 
     private route:Router, 
     public dialog: MatDialog, 
     private breakpointObserver: BreakpointObserver,
     public _upload:UploadsService) { }

  ngOnInit(): void {
    this.getActivity();
    this.getResources();
    this.getTopic();
  }


  getFileExtension(filename) {
    if(filename == 'pdf'){
      return '#EA462E';
    }else if(filename == 'docx'){
      return '#2D5292';
    }
    else if(filename == 'ppt'){
      return '#CA4223';
    }
    else if(filename == 'zip'){
      return '#B23333';
    }
    else if(filename == 'txt'){
      return '#546A7A';
    }else{
      return '#222';
    }
  }

  getfileExt(filename) {
    return filename.split('.').pop();
  }
  
  getActivity(){
    this._ds._httpRequest('getcpost',{classcode:this._user.getSelectedClass().classcode_fld,type:''},1).subscribe((data:any)=>{
      data = this._user._decrypt(data.a);
      this.activities = data.payload;
      for (let i = 0; i < this.activities.length; i++) {
        if (this.activities[i].type_fld === 0 || this.activities[i].type_fld === 1 && this.activities[i].datesched_fld < this._user.getDateToday()) {
          this.activities[i].openQuiz = true;
        }else{
          this.activities[i].openQuiz = false;

        }
        
        
      }
    },er => {
      er = this._user._decrypt(er.error.a);
      // console.log(er);
      
    })
  }

  getResources(){
    this._ds._httpRequest('getreslist',{classcode:this._user.getSelectedClass().classcode_fld},1).subscribe((data:any)=>{
      data = this._user._decrypt(data.a);
      this.resources = data.payload;
      // console.log(this.resources);
      
    },er=>{
      er = this._user._decrypt(er.error.a);
    })
  }

  getTopic(){
    let load = {
      classcode:this._user.getSelectedClass().classcode_fld
    }    
    this._ds._httpRequest('gettopic',load,1).subscribe((data:any)=>{
      data = this._user._decrypt(data.a)
      this.topicObj = data.payload;
      this._user.setTopic(data.payload);
      // console.log(data);
      
    },er=>{
      er = this._user._decrypt(er.error.a);
      this.topicObj = [];
      // console.log(er);
      
    })

  }

  previewResource(link, name) {
    let data = {
      resourceString: link,
      reourcename: name
    }

    const dialogRef = this.dialog.open(ResourcePreviewComponent, {
      panelClass: 'dialogpadding',
      maxWidth: '100vw',
      maxHeight: '100vh',
      disableClose: true,
      data: data
    });

    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('100%', '100%');
      } else {
        dialogRef.updateSize('100%', '100%');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
    })


  }

}
