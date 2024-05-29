import { Component, EventEmitter, Output } from '@angular/core';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';
import { base64ToFile, ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-photo-widget',
  template: `
    <div class="row">
      <div class="col-4">
        <h3>Step 1 - Add Photo</h3>
        <div class="custom-dropzone" ngx-dropzone (change)="onSelect($event)">
          <ngx-dropzone-label>
            <i class="fas fa-upload fa-4x"></i>
            <h4>Drop image here</h4>
          </ngx-dropzone-label>
        </div>
      </div>
      <div class="col-4 img-preview">
        <h3>Step 2 - Resize image</h3>
        <image-cropper
          class="img-fluid"
          [imageChangedEvent]="imageChangedEvent"
          [imageFile]="files[0]"
          [maintainAspectRatio]="true"
          [aspectRatio]="1"
          format="png"
          (imageCropped)="imageCropped($event)"
        >
        </image-cropper>
      </div>
      <div class="col-4">
        <h3>Step 3 - Preview & Upload</h3>
        @if (croppedImage) {
          <img [src]="croppedImage" class="img-fluid" alt="" />
          <button class="btn-block btn-primary" (click)="onUpload()">Upload Image</button>
        }
      </div>
    </div>
  `,
  styleUrls: ['./photo-widget.component.scss'],
  imports: [ImageCropperComponent, NgxDropzoneModule, NgIf],
  standalone: true
})
export class PhotoWidgetComponent {
  @Output() addFile = new EventEmitter();
  files: File[] = [];
  imageChangedEvent: any = '';
  croppedImage: string | null = null;

  constructor() {}

  fileChangeEvent(file: File): void {
    this.imageChangedEvent = file;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64 ?? null;
  }

  onSelect(event: NgxDropzoneChangeEvent) {
    this.files = [];
    this.files.push(...event.addedFiles);
    this.fileChangeEvent(this.files[0]);
  }

  onUpload() {
    if (this.croppedImage) {
      this.addFile.emit(base64ToFile(this.croppedImage));
    }
  }
}
