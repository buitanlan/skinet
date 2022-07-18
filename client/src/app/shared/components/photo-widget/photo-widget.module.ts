/* eslint-disable prettier/prettier */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoWidgetComponent } from './photo-widget.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  declarations: [PhotoWidgetComponent],
  imports: [CommonModule, NgxDropzoneModule, ImageCropperModule],
  exports: [PhotoWidgetComponent]
})
export class PhotoWidgetModule {}
