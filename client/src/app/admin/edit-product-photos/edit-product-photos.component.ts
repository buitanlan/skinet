import { Component, Input } from '@angular/core';
import { Product } from '../../shared/models/product';
import { AdminService } from '../../shared/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { NgForOf, NgIf } from '@angular/common';
import { PhotoWidgetComponent } from '../../shared/components/photo-widget/photo-widget.component';

@Component({
  selector: 'app-edit-product-photos',
  template: `
    <div class="py-5">
      <div class="container">
        <ng-container *ngIf="!addPhotoMode">
          <div class="d-flex justify-content-between mb-3">
            <h3>Product Photos</h3>
            <button class="btn btn-primary" (click)="addPhotoModeToggle()">Add New Photo</button>
          </div>
          <div class="row">
            <div class="col-3" *ngFor="let photo of product?.photos">
              <div class="card">
                <img
                  class="card-img-top"
                  width="100%"
                  height="225"
                  src="{{ photo.pictureUrl }}"
                  alt="{{ photo.fileName }}"
                />
                <div class="btn-group" style="width: 100%">
                  <button
                    type="button"
                    (click)="setMainPhoto(photo.id)"
                    [disabled]="photo.isMain"
                    class="{{ photo.isMain ? 'btn btn-success' : 'btn btn-outline-success' }}"
                    style="width: 50%"
                  >
                    Set Main
                  </button>
                  <button
                    (click)="deletePhoto(photo.id)"
                    type="button"
                    [disabled]="photo.isMain"
                    class="btn btn-outline-danger"
                    style="width: 50%"
                  >
                    <i class="fa fa-trash"></i>      
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="addPhotoMode">
          <div class="d-flex justify-content-between mb-3">
            <h3 class="text-primary">Add new product image</h3>
            <button class="btn btn-outline-secondary" (click)="addPhotoModeToggle()">Cancel</button>
          </div>
          <div class="progress form-group" *ngIf="progress > 0">
            <div class="progress-bar progress-bar-striped bg-success" role="progressbar" [style.width.%]="progress">
              {{ progress }}%
            </div>
          </div>
          <app-photo-widget (addFile)="uploadFile($event)"></app-photo-widget>
        </ng-container>
      </div>
    </div>
  `,
  imports: [NgIf, NgForOf, PhotoWidgetComponent],
  standalone: true
})
export class EditProductPhotosComponent {
	@Input() product = {} as Product;
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
			},
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
			},
		});
	}

	setMainPhoto(photoId: number) {
		this.adminService.setMainPhoto(photoId, this.product.id).subscribe((product: Product) => {
			this.product = product;
		});
	}
}
