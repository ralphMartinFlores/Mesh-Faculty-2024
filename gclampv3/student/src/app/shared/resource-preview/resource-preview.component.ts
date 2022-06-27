import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { DialogComponent } from '../dialog/dialog.component';
import { UploadsService } from 'src/app/services/uploads.service';

@Component({
  selector: 'app-resource-preview',
  templateUrl: './resource-preview.component.html',
  styleUrls: ['./resource-preview.component.scss']
})
export class ResourcePreviewComponent implements OnInit {
  linkPath: any;
  name: string;

  constructor(public _upload:UploadsService,private _ds: DataService, public _user:UserService, @Inject(MAT_DIALOG_DATA) public data: any, private dialogReg: MatDialogRef<DialogComponent>,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getLink(this.data.resourceString);
  }

  getLink(link){
    let embbed:string;
    this.name = this._upload.getfileExt(link);   
    if (this.name.includes('docx') || this.name.includes('xlsx') || this.name.includes('pptx')) {
      embbed = `https://view.officeapps.live.com/op/embed.aspx?src=${link}&embedded=true`
    }
    if (this.name.includes('txt') || this.name.includes('pdf') || this.name.includes('csv')) {
      embbed = link;
    }
    if (this.name.includes('jpg') || this.name.includes('jpeg') || this.name.includes('png')) {
      embbed = link;
    }

    // console.log(embbed);
    
    if (embbed != undefined) {
      this.linkPath = this.sanitizer.bypassSecurityTrustResourceUrl(embbed);
    }else{
      this.linkPath = null
    }
    
    // this.linkPath = this.sanitizer.bypassSecurityTrustResourceUrl(embbed);
  }

}
