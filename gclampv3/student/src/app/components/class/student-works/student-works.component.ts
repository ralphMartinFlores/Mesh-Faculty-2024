import { Component, OnInit } from '@angular/core';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { ResourcePreviewComponent } from 'src/app/shared/resource-preview/resource-preview.component';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { UploadsService } from 'src/app/services/uploads.service';



@Component({
  selector: 'app-student-works',
  templateUrl: './student-works.component.html',
  styleUrls: ['./student-works.component.scss']
})
export class StudentWorksComponent implements OnInit {
  studworks: any;
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);

  constructor(public _upload:UploadsService,
    public _user:UserService, 
    public _ds:DataService, 
    private dialog:MatDialog, 
    private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    // console.log(this._user.getSelectedClass());
    this.getWorks();
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

  getWorks(){
    // console.log(this._user.getSelectedClass().classcode_fld);
    let load = {
      userid:this._user.getUserID(),
      classcode:this._user.getSelectedClass().classcode_fld,
      actcode:'',
      type:''
    }
    
    this._ds._httpRequest('getstudworks',load,1).subscribe((data:any)=>{
      data = this._user._decrypt(data.a);
      this.studworks = data.payload;
      
    },er=>{
      er = this._user._decrypt(er.error.a)
      throw er
    })
  }
}
