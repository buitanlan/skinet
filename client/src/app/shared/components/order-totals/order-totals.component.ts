import { Component, inject, Input } from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgIf } from '@angular/common';
import { BasketService } from '../../services/basket.service';

@Component({
  selector: 'app-order-totals',
  template: `
    <div class="bg-light px-4 px-3 py-3 text-uppercase fw-bold">Order Summary</div>
    <div class="p-4">
      <p class="fst-italic mb-4">Shipping costs will be added depending on choices made during checkout</p>
      @if ( (basketService.basketTotalPrice$ | async); as totals) {
      <ul class="list-unstyled mb-4 ">
        <li class="d-flex justify-content-between py-3 border-bottom">
          <strong class="text-muted">Order subtotal</strong>
          <strong>{{ totals.subtotal | currency }}</strong>
        </li>
        <li class="d-flex justify-content-between py-3 border-bottom">
          <strong class="text-muted">Shipping and handling</strong>
          <strong>{{ totals.shipping | currency }}</strong>
        </li>
        <li class="d-flex justify-content-between py-3 border-bottom">
          <strong class="text-muted">Total</strong>
          <strong>{{ totals.total | currency }}</strong>
        </li>
      </ul>
      }
    </div>
  `,
  imports: [CurrencyPipe, AsyncPipe, NgIf],
  standalone: true
})
export class OrderTotalsComponent {
  readonly basketService = inject(BasketService);
}
