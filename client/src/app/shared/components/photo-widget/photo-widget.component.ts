import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { ImageCroppedEvent, base64ToFile} from 'ngx-image-cropper';

@Component({
  selector: 'app-photo-widget',
  templateUrl: './photo-widget.component.html',
  styleUrls: ['./photo-widget.component.scss']
})
export class PhotoWidgetComponent implements OnInit {
  @Output() addFile = new EventEmitter();
  files: File[] = [];
  imageChangedEvent: any = '';
  croppedImage: string | null = null;

  constructor() { }

  ngOnInit(): void {
  }

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
