import { Component, OnInit } from '@angular/core';
import { IOrder } from '../shared/models/order';
import { OrdersService } from '../shared/services/orders.service';
import { CurrencyPipe, DatePipe, NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  template: `
    <div class="container mt-5">
      <div class="row">
        <div class="col-12">
          <table class="table table-hover" style="cursor: pointer">
            <thead class="thead-light">
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of orders" routerLink="/orders/{{ order.id }}">
                <th># {{ order.id }}</th>
                <td>{{ order.orderDate | date : 'medium' }}</td>
                <td>{{ order.total | currency }}</td>
                <td>{{ order.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  imports: [NgForOf, DatePipe, CurrencyPipe, RouterLink],
  standalone: true
})
export class OrdersComponent implements OnInit {
  orders: IOrder[] = [];

  constructor(private readonly ordersService: OrdersService) {}

  ngOnInit(): void {
    this.getOrders();
  }
  getOrders() {
    this.ordersService.getOrdersForUser().subscribe({
      next: (orders: IOrder[]) => {
        this.orders = orders;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
