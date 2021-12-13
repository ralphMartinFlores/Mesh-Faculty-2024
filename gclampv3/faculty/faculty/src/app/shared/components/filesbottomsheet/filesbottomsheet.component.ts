import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { UploadingService } from 'src/app/services/uploading.service';

@Component({
  selector: 'app-filesbottomsheet',
  templateUrl: './filesbottomsheet.component.html',
  styleUrls: ['./filesbottomsheet.component.scss']
})
export class FilesbottomsheetComponent implements OnInit {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data, public uploadservices: UploadingService) { }

  ngOnInit(): void {
    console.log(this.data);
  }

}
