import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Basket, BasketItem, BasketQuantity, IBasketTotals } from '../models/basket';
import { DeliveryMethod } from '../models/deliveryMethod';
import { Product } from '../models/product';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<Basket | null>(null);
  basket$ = this.basketSource.asObservable();
  private basketTotalPriceSource = new BehaviorSubject<IBasketTotals | null>(null);
  basketTotalPrice$ = this.basketTotalPriceSource.asObservable();
  private basketTotalQuantitySource = new BehaviorSubject<BasketQuantity | null>(null);
  basketTotalQuantity$ = this.basketTotalQuantitySource.asObservable();
  shipping = 0;

  constructor(private readonly http: HttpClient) {}

  createPaymentIntent() {
    return this.http.post<Basket>(this.baseUrl + 'payments/' + this.getCurrentBasketValue()?.id, {}).pipe(
      map((basket: Basket) => {
        if (basket) {
          this.basketSource.next(basket);
        }
      })
    );
  }

  setShippingPrice(deliveryMethod: DeliveryMethod) {
    this.shipping = deliveryMethod.price;
    const basket = this.getCurrentBasketValue();
    if (basket) {
      basket.deliveryMethodId = deliveryMethod.id;
      this.calculateTotalPrice();
      this.setBasket(basket);
    }
  }

  getBasket(id: string) {
    return this.http.get<Basket>(this.baseUrl + 'basket?id=' + id).pipe(
      map((basket: Basket) => {
        this.basketSource.next(basket);
        this.shipping = basket.shippingPrice ?? 0;
        this.calculateTotalPrice();
        this.calculateTotalQuantity();
      })
    );
  }

  calculateTotalQuantity() {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      const quantity = basket.items.reduce((sum, item) => sum + item.quantity, 0);
      this.basketTotalQuantitySource.next({ quantity });
    }
  }

  setBasket(basket: Basket) {
    return this.http.post<Basket>(this.baseUrl + 'basket', basket).subscribe(
      (response: Basket) => {
        this.basketSource.next(response);
        this.calculateTotalPrice();
        this.calculateTotalQuantity();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  addItemToBasket(item: Product, quantity = 1) {
    const itemToAdd: BasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }

  incrementItemQuantity(item: BasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      const foundItemIndex = basket.items.findIndex((x) => x.id === item.id);
      basket.items[foundItemIndex].quantity++;
      this.setBasket(basket);
    }
  }

  decrementItemQuantity(item: BasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      const foundItemIndex = basket.items.findIndex((x) => x.id === item.id);
      if (basket.items[foundItemIndex].quantity >= 1) {
        basket.items[foundItemIndex].quantity--;
        this.setBasket(basket);
      } else {
        this.removeItemFromBasket(item);
      }
    }
  }

  removeItemFromBasket(item: BasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      if (basket.items.some((x) => x.id === item.id)) {
        basket.items = basket.items.filter((x) => x.id !== item.id);
        if (basket.items.length > 0) {
          this.setBasket(basket);
        } else {
          this.deleteBasket(basket);
        }
      }
    }
  }

  deleteBasket(basket: Basket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(
      () => {
        this.basketSource.next(null);
        this.basketTotalPriceSource.next(null);
        this.basketTotalQuantitySource.next(null);
        localStorage.removeItem('basketId');
      },
      (error) => console.log(error)
    );
  }

  private calculateTotalPrice() {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      const shipping = this.shipping;
      const subtotal = basket.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const total = subtotal + shipping;
      this.basketTotalPriceSource.next({ shipping, total, subtotal });
    }
  }

  private addOrUpdateItem(items: BasketItem[], itemToAdd: BasketItem, quantity: number): BasketItem[] {
    if (!items) {
      items = [];
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      const index = items.findIndex((i) => i.id === itemToAdd.id);
      if (index === -1) {
        itemToAdd.quantity = quantity;
        items.push(itemToAdd);
      } else {
        items[index].quantity += quantity;
      }
    }
    return items;
  }

  private createBasket(): Basket {
    const basket = new Basket();
    localStorage.setItem('basketId', basket.id);
    return basket;
  }

  private mapProductItemToBasketItem(item: Product, quantity: number): BasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    };
  }
}
