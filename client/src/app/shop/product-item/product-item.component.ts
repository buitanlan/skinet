import { Component, Input } from '@angular/core';
import { BasketService } from 'src/app/shared/services/basket.service';
import { Product } from 'src/app/shared/models/product';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-item',
  template: `
    <div class="card h-100 shadow-sm">
      <div class="image position-relative" style="cursor: pointer">
        <img src="{{ product.pictureUrl }}" alt="{{ product.name }}" class="img-fluid bg-info" />
        <div class="d-flex align-items-center justify-content-center hover-overlay">
          <button (click)="addItemToBasket()" type="button" class="btn btn-primary me-2">
            <i class="fas fa-shopping-cart"></i>
          </button>
          <button routerLink="/shop/{{ product.id }}" type="button" class="btn btn-primary">View</button>
        </div>
      </div>

      <div class="card-body d-flex flex-column">
        <a routerLink="/shop/{{ product.id }}">
          <h6 class="text-uppercase">{{ product.name }}</h6>
        </a>
        <span class="mb-2">{{ product.price | currency }}</span>
      </div>
    </div>
  `,
  styleUrls: ['./product-item.component.scss'],
  imports: [CurrencyPipe, RouterLink],
  standalone: true
})
export class ProductItemComponent {
	@Input() product!: Product;

	constructor(private readonly basketService: BasketService) {}

	addItemToBasket() {
		this.basketService.addItemToBasket(this.product);
	}
}
