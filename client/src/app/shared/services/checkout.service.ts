import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DeliveryMethod } from '../models/deliveryMethod';
import { OrderToCreate } from '../models/order';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  createOrder(order: OrderToCreate) {
    return this.http.post<OrderToCreate>(this.baseUrl + 'orders', order);
  }

  getDeliveryMethod() {
    return this.http.get<DeliveryMethod[]>(this.baseUrl + 'orders/deliveryMethods').pipe(
      map((dm: DeliveryMethod[]) => {
        return dm.sort((a, b) => b.price - a.price);
      })
    );
  }
}
