import { Component, OnInit } from '@angular/core';
import { IOrder } from '../shared/models/order';
import { OrdersService } from './orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
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
