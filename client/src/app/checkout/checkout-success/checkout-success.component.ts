import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { Order } from '../../shared/models/order';

@Component({
  selector: 'app-checkout-success',
  template: `
    <div class="container mt-5">
      <div><i class="fas fa-check-circle fa-5x" style="color: green"></i></div>
      <h2>Thank you.You order is confirmed</h2>
      <p class="mb-4">Your order shopped yet, but this is to be expected as we are not a real store</p>
      @if (order) {
      <button routerLink="/orders/{{ order.id }}" class="btn btn-outline-success">View your order</button>
      } @if (!order) {
      <button routerLink="/orders" class="btn btn-outline-success">View your orders</button>
      }
    </div>
  `,
  imports: [NgIf, RouterLink],
  standalone: true
})
export class CheckoutSuccessComponent {
  order = {} as Order;

  constructor(private readonly router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation && navigation.extras && navigation.extras.state;
    if (state) {
      this.order = state as Order;
    }
  }
}
