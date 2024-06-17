import { Component, input, output } from '@angular/core';
import { BasketItem } from '../../models/basket';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-basket-summary',

  template: `
    @if (items().length > 0) {
      <div class="table-responsive">
        <table class="table table-borderless">
          <thead [class.thead-light]="isBasket() || isOrder()" class="border-0 py-2">
            <tr>
              <th scope="col">
                <div class="p-2 px-3 text-uppercase">Product</div>
              </th>
              <th scope="col">
                <div class="py-2 text-uppercase">Price</div>
              </th>
              <th scope="col">
                <div class="py-2 text-uppercase">Quantity</div>
              </th>
              <th scope="col">
                <div class="py-2 text-uppercase">Total</div>
              </th>
              @if (isBasket()) {
                <th scope="col">
                  <div class="py-2 text-uppercase">Remove</div>
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @for (item of items(); track item) {
              <tr>
                <th scope="row">
                  <div class="p-0 d-flex">
                    <img
                      src="{{ item.pictureUrl }}"
                      alt="{{ item.productName }}"
                      class="img-fluid"
                      style="max-height: 50px"
                    />
                    <div class="me-3 d-inline-block align-middle">
                      <h5 class="mb-0">
                        <a routerLink="/shop/{{ item.id }}" class="text-dark"> {{ item.productName }}</a>
                      </h5>
                      @if (item.type) {
                        <span class="text-muted font-weight-normal font-italic d-block"> Type: {{ item.type }} </span>
                      }
                    </div>
                  </div>
                </th>
                <td class="align-middle">
                  <strong>
                    {{ item.price | currency }}
                  </strong>
                </td>
                <td class="align-middle">
                  <div class="d-flex align-items-center" [class.justify-content-center]="!isBasket()">
                    @if (isBasket()) {
                      <i
                        (click)="decrementItemQuantity(item)"
                        class="fas fa-minus-circle text-warning me-2"
                        style="cursor: pointer; font-size: 2em"
                      ></i>
                    }
                    <span class="font-weight-bold" style="font-size: 1.5em">{{ item.quantity }}</span>
                    @if (isBasket()) {
                      <i
                        (click)="incrementItemQuantity(item)"
                        class="fas fa-plus-circle text-warning mx-2"
                        style="cursor: pointer; font-size: 2em"
                      ></i>
                    }
                  </div>
                </td>
                <td class="align-middle">
                  <strong>{{ item.price * item.quantity | currency }}</strong>
                </td>
                <td class="align-middle text-center">
                  <a class="text-danger">
                    @if (isBasket()) {
                      <i
                        (click)="removeBasketItem(item)"
                        class="fas fa-trash"
                        style="font-size: 1.5em; cursor: pointer"
                      ></i>
                    }
                  </a>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  imports: [CurrencyPipe, RouterLink],
  standalone: true
})
export class BasketSummaryComponent {
  isBasket = input(true);
  isOrder = input(false);
  items = input<any>();
  decrement = output<BasketItem>();
  increment = output<BasketItem>();
  remove = output<BasketItem>();

  removeBasketItem(item: BasketItem) {
    this.remove.emit(item);
  }

  decrementItemQuantity(item: BasketItem) {
    this.decrement.emit(item);
  }

  incrementItemQuantity(item: BasketItem) {
    this.increment.emit(item);
  }
}
