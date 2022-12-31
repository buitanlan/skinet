import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-totals',
  template: `
    <div class="bg-light px-4 px-3 py-3 text-uppercase font-weight-bold">Order Summary</div>
    <div class="p-4">
      <p class="font-italic mb-4">Shipping costs will be added depending on choices made during checkout</p>
      <ul class="list-unstyled mb-4">
        <li class="d-flex justify-content-between py-3 border-bottom">
          <strong class="text-muted">Order subtotal</strong>
          <strong>{{ subtotal | currency }}</strong>
        </li>
        <li class="d-flex justify-content-between py-3 border-bottom">
          <strong class="text-muted">Shipping and handling</strong>
          <strong>{{ shippingPrice | currency }}</strong>
        </li>
        <li class="d-flex justify-content-between py-3 border-bottom">
          <strong class="text-muted">Total</strong>
          <strong>{{ total | currency }}</strong>
        </li>
      </ul>
    </div>
  `,
  imports: [CurrencyPipe],
  standalone: true
})
export class OrderTotalsComponent {
  @Input() shippingPrice = 0;
  @Input() subtotal = 0;
  @Input() total = 0;
  constructor() {}
}
