import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { DeliveryMethod } from '../models/deliveryMethod';
import { OrderToCreate } from '../models/order';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private readonly http = inject(HttpClient);
  baseUrl = environment.apiUrl;

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
