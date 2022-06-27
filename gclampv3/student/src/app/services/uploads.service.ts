import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ResourcePreviewComponent } from '../shared/resource-preview/resource-preview.component';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { DataService } from './data.service';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadsService {
  files: any = [];
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);

  constructor(public _ds: DataService, public _user: UserService, public dialog: MatDialog, private breakpointObserver: BreakpointObserver) { }

  async Filepath(data) {
    let formdata: FormData;
    let requestURL = `upload/${this._user.getUserID()}/${this._user.getSettings().acadyear_fld}/${this._user.getSettings().sem_fld}`
    formdata = this.uploadFile(data);
    return new Promise((resolve, rejects) => {
      this._ds._httpRequest(requestURL, formdata, 3).subscribe((data: any) => {
        data = this._user._decrypt(data.a);
        // console.log(data);

        resolve(data.payload.filepath);
      }, er => {
        return new Promise(() => {
          rejects(null);
        });
      });
    })
  }

  uploadFile(payload) {
    const formData = new FormData();
    for (var i = 0; i < this.files.length; i++) {
      formData.append('file[]', this.files[i]);
    }
    formData.append('payload', JSON.stringify(payload));
    return formData;
  }

  getFile(event: any) {
    this.files = event;
  }

  getfileExt(filename) {
    return filename.split('.').pop();
  }

  splitFilestring(filestring: string) {
    let arr1 = filestring.split(':');
    let filearray: { name: string; link: string, path: string }[] = [];
    for (let i = 0; i < arr1.length; i++) {
      let arr2 = arr1[i].split('?');
      filearray.push({ name: arr2[0], link: this._ds.fileUrl + arr2[1], path: arr2[1] });
    }
    return filearray;
  }


  // Start of Elapsed time
  getElapsedTime(time) {
    // Record end time
    let endTime: Date = new Date();
    let startTime: Date = new Date(time);
    // Compute time difference in milliseconds
    let timeDiff: number = endTime.getTime() - startTime.getTime()
    // Convert time difference from milliseconds to seconds
    timeDiff = timeDiff / 1000;
    // Extract integer seconds that do not form a minute using %
    let seconds: number = Math.floor(timeDiff % 60);
    // Pad seconds with a zero (if necessary) and convert to string
    let secondsAsString: string | number = seconds;
    // Convert time difference from seconds to minutes using %
    timeDiff = Math.floor(timeDiff / 60);
    // Extract integer minutes that don't form an hour using %
    let minutes: number = timeDiff % 60;
    // Pad minutes with a zero (if necessary) and convert to string
    let minuteAsString: string | number = minutes;
    // Convert time difference from minutes to hours
    timeDiff = Math.floor(timeDiff / 60);
    // Extract integer hours that don't form a day using %
    let hours: number = timeDiff % 24;
    // Convert time difference from hours to day
    timeDiff = Math.floor(timeDiff / 24);
    // The rest of timeDiff is number of days
    let days: number = timeDiff;
    let totalHours: number = hours + (days * 24); // add days to hours
    // Pad hours with a zero (if necessary) and convert to string
    let totalHoursAsString: string | number = totalHours;
    // return secondsAsString

    let month = startTime.toLocaleString('default', { month: 'long' });
    let day = startTime.toLocaleString('default', { day: 'numeric' });
    let yr = startTime.toLocaleString('default', { year: 'numeric' });
    let hr = startTime.toLocaleString('default', { hour: 'numeric' });
    let min = startTime.toLocaleString('default', { minute: '2-digit' });
    let sec = startTime.toLocaleString('default', { second: '2-digit' });





    if (days <= 0 && secondsAsString <= 59 && minuteAsString <= 0 && totalHoursAsString <= 0) {
      return "Just now."
    } else if (days <= 0 && secondsAsString <= 59 && minuteAsString <= 59 && totalHoursAsString <= 0) {
      return minuteAsString == 1 ? `${minuteAsString} minute ago` : `${minuteAsString} minutes ago`
    } else if (days <= 0 && secondsAsString <= 59 && minuteAsString <= 59 && totalHoursAsString <= 59) {
      return totalHoursAsString == 1 ? `${totalHoursAsString} hour ago` : `${totalHoursAsString} hours ago`
    } else if (days == 1) {
      return "1 day ago"
    } else {
      return month + " " + day + ", " + yr + " " + hr
    }

  }


  async splitPollContent(pollcontent: any) {
    let contentvalue = await pollcontent.content_fld.split('($)');
    let pollOpt: any = await contentvalue[1];
    pollOpt = await pollOpt.split('(*)');
    return { content_fld: contentvalue[0], pollchoices_fld: pollOpt };
  }
}
