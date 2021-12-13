import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-viewpoll',
  templateUrl: './viewpoll.component.html',
  styleUrls: ['./viewpoll.component.scss']
})
export class ViewpollComponent implements OnInit {

  constructor( @Inject(MAT_DIALOG_DATA) public data, public ds: DataService) { }

  ngOnInit(): void {
  }

}
