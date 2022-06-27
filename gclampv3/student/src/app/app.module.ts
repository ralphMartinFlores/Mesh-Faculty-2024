import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { MainLayoutModule } from './layout/layout.module';
import { LocationStrategy, HashLocationStrategy, DatePipe } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChangePassModalComponent } from './components/profile/change-pass-modal/change-pass-modal.component';
import { MatCardModule } from '@angular/material/card';
import { NgxImageCompressService } from 'ngx-image-compress';
import { MatDialogModule } from '@angular/material/dialog';

//
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppConfig } from './services/data-schema';
import { ConfigService } from './services/config.service';
import { ShopdialogComponent } from './components/quest/shopdialog/shopdialog.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


export function getConfig(cs: ConfigService){
  return ()=>{
    return cs.load()
  }
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChangePassModalComponent,
    ShopdialogComponent,


    // UpdateProfileModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MainLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
    LayoutModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    FlexLayoutModule, 
    BrowserAnimationsModule,
    MatCardModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    {
      provide: AppConfig,
      deps: [HttpClient],
      useExisting: ConfigService
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ConfigService],
      useFactory: getConfig
    },
    NgxImageCompressService,
    {provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
