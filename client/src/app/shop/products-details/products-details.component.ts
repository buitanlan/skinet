import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasketService } from 'src/app/shared/services/basket.service';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../../shared/services/shop.service';
import {
	NgxGalleryAnimation,
	NgxGalleryImage,
	NgxGalleryImageSize,
	NgxGalleryModule,
	NgxGalleryOptions,
} from '@kolkov/ngx-gallery';
import { CurrencyPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-products-details',
  template: `
    <div class="container">
      <div class="row" *ngIf="product">
        <div class="col-6">
          <ngx-gallery
            [options]="galleryOptions"
            [images]="galleryImages"
            style="display: inline-block; margin-bottom: 20px"
          >
          </ngx-gallery>
        </div>
        <div class="col-6 mt-5">
          <h3>
            {{ product.name }}
          </h3>
          <p style="font-size: 1.5em">{{ product.price | currency }}</p>
          <div class="d-flex justify-content-start align-items-center">
            <i
              (click)="decrementQuantity()"
              class="fas fa-minus-circle text-warning me-2"
              style="cursor: pointer; font-size: 2em"
            ></i>
            <span class="font-weight-bold" style="font-size: 1.5em">{{ quantity }}</span>
            <i
              (click)="incrementQuantity()"
              class="fas fa-plus-circle text-warning mx-2"
              style="cursor: pointer; font-size: 2em"
            ></i>
            <button (click)="addItemToBasket()" class="btn btn-outline-primary btn-lg ms-4">Add to Cart</button>
          </div>
        </div>
        <div class="row mt-5">
          <div class="col-12 ms-3">
            <h4>Description</h4>
            <p>{{ product.description }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [CurrencyPipe, NgIf, NgxGalleryModule],
  standalone: true
})
export class ProductsDetailsComponent implements OnInit {
	product = {} as IProduct;
	quantity = 1;
	galleryOptions!: NgxGalleryOptions[];
	galleryImages!: NgxGalleryImage[];

	constructor(
		private readonly shopService: ShopService,
		private readonly activatedRoute: ActivatedRoute,
		private readonly bcService: BreadcrumbService,
		private readonly basketService: BasketService,
	) {
		this.bcService.set('@productDetails', '');
	}

	ngOnInit(): void {
		this.loadProduct();
	}

	initializeGallery() {
		this.galleryOptions = [
			{
				width: '500px',
				height: '600px',
				imagePercent: 100,
				thumbnailsColumns: 4,
				imageAnimation: NgxGalleryAnimation.Fade,
				imageSize: NgxGalleryImageSize.Contain,
				thumbnailSize: NgxGalleryImageSize.Contain,
				preview: false,
			},
		];
		this.galleryImages = this.getImages();
	}

	getImages() {
		const imageUrls = [] as NgxGalleryImage[];
		for (const photo of this.product.photos) {
			imageUrls.push({
				small: photo.pictureUrl,
				medium: photo.pictureUrl,
				big: photo.pictureUrl,
			});
		}
		return imageUrls;
	}

	addItemToBasket() {
		this.basketService.addItemToBasket(this.product, this.quantity);
	}

	incrementQuantity() {
		this.quantity++;
	}

	decrementQuantity() {
		if (this.quantity > 1) {
			this.quantity--;
		}
	}

	loadProduct() {
		this.shopService.getProduct(Number(this.activatedRoute.snapshot.paramMap.get('id'))).subscribe({
			next: (product) => {
				this.product = product;
				this.bcService.set('@productDetails', product.name);
				this.initializeGallery();
			},
			error: (error) => console.log(error),
		});
	}
}
