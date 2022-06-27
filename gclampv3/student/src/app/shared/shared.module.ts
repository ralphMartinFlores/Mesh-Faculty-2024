import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadDirective } from './lazy-load.directive';
import { DialogComponent } from './dialog/dialog.component';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { LoadingscreenComponent } from './loadingscreen/loadingscreen.component';
import { PostsEditComponent } from './posts-edit/posts-edit.component';
import { ResourcePreviewComponent } from './resource-preview/resource-preview.component';



@NgModule({
  declarations: [LazyLoadDirective, DialogComponent, ImagePreviewComponent, LoadingscreenComponent, PostsEditComponent, ResourcePreviewComponent],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
