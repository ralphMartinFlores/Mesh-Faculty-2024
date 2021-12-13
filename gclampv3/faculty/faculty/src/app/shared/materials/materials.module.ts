import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ANGULAR MATERIALS
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatBadgeModule} from '@angular/material/badge';
import { MatTimepickerModule } from 'mat-timepicker';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {NgxMatTimepickerModule} from 'ngx-mat-timepicker';

const MaterialsComponents = [
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatInputModule,
  MatButtonModule,
  MatInputModule,
  MatCardModule,
  MatIconModule,
  MatStepperModule,
  MatFormFieldModule,
  MatListModule,
  MatNativeDateModule,
  MatMenuModule,
  MatTabsModule,
  MatDialogModule,
  MatIconModule,
  MatFormFieldModule,
  MatCardModule,
  MatButtonModule,
  MatInputModule,
  MatProgressBarModule,
  MatSelectModule,
  MatExpansionModule,
  MatRadioModule,
  MatTooltipModule,
  MatTableModule,
  MatBottomSheetModule,
  MatCheckboxModule,
  MatSnackBarModule,
  MatSortModule,
  MatPaginatorModule,
  MatSlideToggleModule,
  MatDatepickerModule,
  MatProgressSpinnerModule,
  MatBadgeModule,
  MatTimepickerModule,
  NgxMatTimepickerModule.setLocale('en-GB')
];


@NgModule({
  imports: [MaterialsComponents],
  exports: [MaterialsComponents],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ]
})
export class MaterialsModule { }
