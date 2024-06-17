import { Component, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BasketService } from '../../shared/services/basket.service';
import { Product } from '../../shared/models/product';

@Component({
  selector: 'app-product-item',

  template: `
    <div class="card h-100 shadow-sm">
      <div class="image position-relative" style="cursor: pointer">
        <img src="{{ product().pictureUrl }}" alt="{{ product().name }}" class="img-fluid bg-info" />
        <div class="d-flex align-items-center justify-content-center hover-overlay">
          <button (click)="addItemToBasket()" type="button" class="btn btn-primary me-2">
            <i class="fas fa-shopping-cart"></i>
          </button>
          <button routerLink="/shop/{{ product().id }}" type="button" class="btn btn-primary">View</button>
        </div>
      </div>

      <div class="card-body d-flex flex-column">
        <a routerLink="/shop/{{ product().id }}">
          <h6 class="text-uppercase">{{ product().name }}</h6>
        </a>
        <span class="mb-2">{{ product().price | currency }}</span>
      </div>
    </div>
  `,
  styleUrls: ['./product-item.component.scss'],
  imports: [CurrencyPipe, RouterLink],
  standalone: true
})
export class ProductItemComponent {
  product = input.required<Product>();

  readonly basketService = inject(BasketService);

  addItemToBasket() {
    this.basketService.addItemToBasket(this.product());
  }
}
