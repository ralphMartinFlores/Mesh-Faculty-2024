import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CallSettingsComponent } from './call-settings/call-settings.component';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss']
})
export class CallComponent implements OnInit {

  constructor(private _dialog: MatDialog) { }

  ngOnInit(): void {
  }

  public callSettingsDialog (): void {
    let dialogRef = this._dialog.open(CallSettingsComponent, {
      maxHeight: "85vh",
      maxWidth: "90vw"
    });
  }

}
