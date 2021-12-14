import { Component, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
// Imports for responsive sidenav
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { delay } from 'rxjs/operators';
import { timer } from 'rxjs';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss']
})
export class MeetingListComponent {

// Variables needed for a responsive sidenav
@ViewChild(MatSidenav)
sidenav!: MatSidenav;
datetime: Date;

constructor(private observer: BreakpointObserver) { }
 
meetingObj : any = [];

ngAfterViewInit() {

 timer(0, 1000).subscribe(() => {
   this.datetime = new Date()
 })

  this.meetingObj();
  // Observes for breakpoint changes and changes sidenav mode to be more responsive
  this.observer
    .observe(['(max-width: 800px)'])
    .pipe(delay(1))
    .subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
}

}
