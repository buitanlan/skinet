import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../../shared/services/shop.service';
import { CurrencyPipe } from '@angular/common';
import { BasketService } from '../../shared/services/basket.service';
import { Product } from '../../shared/models/product';

@Component({
  selector: 'app-products-details',
  template: `
    <div class="container">
      @if (product()) {
        <div class="row">
          <div class="col-6 mt-5">
            <div class="product-gallery">
              <img
                [src]="selectedPhotoUrl()"
                [alt]="product().name"
                class="img-fluid rounded border mb-3 w-100"
                style="max-height: 600px; object-fit: contain"
              />
              @if (photoUrls().length > 1) {
                <div class="d-flex flex-wrap gap-2">
                  @for (photoUrl of photoUrls(); track photoUrl) {
                    <button
                      type="button"
                      class="p-0 border rounded"
                      [class.border-primary]="photoUrl === selectedPhotoUrl()"
                      (click)="selectPhoto(photoUrl)"
                    >
                      <img [src]="photoUrl" [alt]="product().name" class="img-fluid" style="width: 80px; height: 80px; object-fit: cover" />
                    </button>
                  }
                </div>
              }
            </div>
          </div>
          <div class="col-6 mt-5">
            <h3>
              {{ product().name }}
            </h3>
            <p style="font-size: 1.5em">{{ product().price | currency }}</p>
            <div class="d-flex justify-content-start align-items-center">
              <i
                (click)="decrementQuantity()"
                class="fas fa-minus-circle text-warning me-2"
                style="cursor: pointer; font-size: 2em"
              ></i>
              <span class="font-weight-bold" style="font-size: 1.5em">{{ quantity() }}</span>
              <i
                (click)="incrementQuantity()"
                class="fas fa-plus-circle text-warning mx-2"
                style="cursor: pointer; font-size: 2em"
              ></i>
              <button (click)="addItemToBasket()" class="btn btn-outline-primary btn-lg ms-4">Add to Cart</button>
            </div>
          </div>
          <div class="row mt-5">
            <div class="col-12 me-3">
              <h4>Description</h4>
              <p>{{ product().description }}</p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  imports: [CurrencyPipe],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsDetailsComponent implements OnInit {
  private readonly shopService = inject(ShopService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly bcService = inject(BreadcrumbService);
  private readonly basketService = inject(BasketService);
  readonly product = signal({} as Product);
  readonly quantity = signal(1);
  readonly photoUrls = signal<string[]>([]);
  readonly selectedPhotoUrl = signal('');

  constructor() {
    this.bcService.set('@productDetails', '');
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  selectPhoto(photoUrl: string) {
    this.selectedPhotoUrl.set(photoUrl);
  }

  addItemToBasket() {
    this.basketService.addItemToBasket(this.product(), this.quantity());
  }

  incrementQuantity() {
    this.quantity.update((value) => value + 1);
  }

  decrementQuantity() {
    this.quantity.update((value) => (value > 1 ? value - 1 : value));
  }

  loadProduct() {
    this.shopService.getProduct(Number(this.activatedRoute.snapshot.paramMap.get('id'))).subscribe({
      next: (product) => {
        this.product.set(product);
        this.bcService.set('@productDetails', product.name);
        const urls = product.photos.map((photo) => photo.pictureUrl);
        this.photoUrls.set(urls);
        this.selectedPhotoUrl.set(urls[0] ?? '');
      },
      error: (error: unknown) => console.log(error)
    });
  }
}
