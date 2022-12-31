import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { BasketService } from '../shared/services/basket.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { OrderTotalsComponent } from '../shared/components/order-totals/order-totals.component';
import { RouterLink } from '@angular/router';
import { BasketSummaryComponent } from '../shared/components/basket-summary/basket-summary.component';

@Component({
  selector: 'app-basket',
  template: `
    <div class="container mt-5">
      <div class="col-4 offset-4">
        <ng-template #loading>
          <i class="fas fa-shopping-cart fa-7x my-3 d-flex justify-content-center"></i>

          <p class="d-flex justify-content-center">Your cart is empty!</p>
          <a routerLink="/shop" class="d-flex justify-content-center btn btn-outline-primary"> Keep shopping </a>
        </ng-template>
      </div>
      <div *ngIf="basket$ | async as basket; else loading">
        <div class="pb-5">
          <div class="container">
            <div class="row">
              <div class="col-12 py-5 mb-1">
                <app-basket-summary
                  (decrement)="decrementItemQuantity($event)"
                  (increment)="incrementItemQuantity($event)"
                  (remove)="removeBasketItem($event)"
                  [items]="basket.items"
                >
                </app-basket-summary>
              </div>
            </div>

            <div class="row">
              <div class="col-6 offset-6">
                <app-order-totals
                  *ngIf="basketTotalPrice$ | async as basketTotalPrice"
                  [shippingPrice]="basketTotalPrice.shipping"
                  [subtotal]="basketTotalPrice.subtotal"
                  [total]="basketTotalPrice.total"
                >
                </app-order-totals>
                <a routerLink="/checkout" class="btn btn-outline-primary py-2 btn-block"> Proceed to checkout </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./basket.component.scss'],
  imports: [NgIf, OrderTotalsComponent, AsyncPipe, RouterLink, BasketSummaryComponent],
  standalone: true
})
export class BasketComponent implements OnInit {
  basket$!: Observable<IBasket | null>;
  basketTotalPrice$!: Observable<IBasketTotals | null>;

  constructor(private readonly basketService: BasketService) {}

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
    this.basketTotalPrice$ = this.basketService.basketTotalPrice$;
  }
  removeBasketItem(item: IBasketItem) {
    this.basketService.removeItemFromBasket(item);
  }
  decrementItemQuantity(item: IBasketItem) {
    this.basketService.decrementItemQuantity(item);
  }
  incrementItemQuantity(item: IBasketItem) {
    this.basketService.incrementItemQuantity(item);
  }
}
