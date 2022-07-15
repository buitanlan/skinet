import { Component, Input } from '@angular/core';
import { IProduct } from '../../shared/models/product';
import { AdminService } from '../admin.service';
import { ToastrService } from 'ngx-toastr';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-edit-product-photos',
  templateUrl: './edit-product-photos.component.html',
  styleUrls: ['./edit-product-photos.component.scss']
})
export class EditProductPhotosComponent {
  @Input() product = {} as IProduct;
  progress = 0;
  addPhotoMode = false;

  constructor(private readonly adminService: AdminService, private readonly toast: ToastrService) {}

  addPhotoModeToggle() {
    this.addPhotoMode = !this.addPhotoMode;
  }

  uploadFile(file: File) {
    this.adminService.uploadImage(file, this.product.id).subscribe({
      next: (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.total) {
              this.progress = Math.round((event.loaded / event.total) * 100);
            }
            break;
          case HttpEventType.Response:
            this.product = event.body;
            setTimeout(() => {
              this.progress = 0;
              this.addPhotoMode = false;
            }, 1500);
        }
      },
      error: (error) => {
        if (error.errors) {
          this.toast.error(error.errors[0]);
        } else {
          this.toast.error('Problem uploading image');
        }
        this.progress = 0;
      }
    });
  }

  deletePhoto(photoId: number) {
    this.adminService.deleteProductPhoto(photoId, this.product.id).subscribe({
      next: () => {
        const photoIndex = this.product.photos.findIndex((x) => x.id === photoId);
        this.product.photos.splice(photoIndex, 1);
      },
      error: (error) => {
        this.toast.error('Problem deleting photo');
        console.log(error);
      }
    });
  }

  setMainPhoto(photoId: number) {
    this.adminService.setMainPhoto(photoId, this.product.id).subscribe((product: IProduct) => {
      this.product = product;
    });
  }
}
