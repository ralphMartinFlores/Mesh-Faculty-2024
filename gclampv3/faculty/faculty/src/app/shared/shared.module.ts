import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadDirective } from './Directives/lazy-load.directive';
import { MaterialsModule } from './materials/materials.module';
import { ViewpollComponent } from './components/viewpoll/viewpoll/viewpoll.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialsModule
  ],
  declarations: [LazyLoadDirective, ViewpollComponent],
  exports: [LazyLoadDirective, MaterialsModule]
})
export class SharedModule { }
