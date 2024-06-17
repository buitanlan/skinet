import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Order } from '../models/order';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  getOrdersForUser() {
    return this.http.get<Order[]>(this.baseUrl + 'orders');
  }

  getOrderDetailed(id: number) {
    return this.http.get<Order>(this.baseUrl + 'orders/' + id);
  }
}
