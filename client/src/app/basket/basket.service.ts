import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketQuantity, IBasketTotals } from '../shared/models/basket';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket | null>(null);
  basket$ = this.basketSource.asObservable();
  private basketTotalPriceSource = new BehaviorSubject<IBasketTotals | null>(null);
  basketTotalPrice$ = this.basketTotalPriceSource.asObservable();
  private basketTotalQuantitySource = new BehaviorSubject<IBasketQuantity| null>(null);
  basketTotalQuantity$ = this.basketTotalQuantitySource.asObservable();
  shipping = 0;

  constructor(private http: HttpClient) {}

  createPaymentIntent(){
    return this.http.post<IBasket>(this.baseUrl + 'payments/' + this.getCurrentBasketValue()?.id, {}).pipe(
      map((basket: IBasket) => {
        if (basket) {
          this.basketSource.next(basket);
        }
      })
    );
  }
  setShippingPrice(deliveryMethod: IDeliveryMethod){
    this.shipping = deliveryMethod.price;
    const basket = this.getCurrentBasketValue();
    if (basket) {
      basket.deliveryMethodId = deliveryMethod.id;
      this.calculateTotalPrice();
      this.setBasket(basket);
    }
  }
  getBasket(id: string) {
    return this.http.get<IBasket>(this.baseUrl + 'basket?id=' + id).pipe(
      map((basket: IBasket) => {
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
      const quantity = basket.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      this.basketTotalQuantitySource.next({ quantity });
    }
  }
  setBasket(basket: IBasket) {
    return this.http.post<IBasket>(this.baseUrl + 'basket', basket).subscribe(
      (response: IBasket) => {
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
  addItemToBasket(item: IProduct, quantity = 1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(
      item,
      quantity
    );
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }
  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      const foundItemIndex = basket.items.findIndex((x) => x.id === item.id);
      basket.items[foundItemIndex].quantity++;
      this.setBasket(basket);
    }
  }
  decrementItemQuantity(item: IBasketItem) {
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
  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      if (basket.items.some(x => x.id === item.id)) {
        basket.items = basket.items.filter(x => x.id !== item.id);
        if (basket.items.length > 0) {
          this.setBasket(basket);
        } else {
          this.deleteBasket(basket);
        }
      }
    }
  }

  deleteLocalBasket(id: string){
    this.basketSource.next(null);
    this.basketTotalPriceSource.next(null);
    this.basketTotalQuantitySource.next(null);
    localStorage.removeItem('basketId');
  }
  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(() => {
      this.basketSource.next(null);
      this.basketTotalPriceSource.next(null);
      this.basketTotalQuantitySource.next(null);
      localStorage.removeItem('basketId');
    }, error => console.log(error));
  }
  private calculateTotalPrice() {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      const shipping = this.shipping;
      const subtotal = basket.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const total = subtotal + shipping;
      this.basketTotalPriceSource.next({ shipping, total, subtotal });
    }
  }
  private addOrUpdateItem(
    items: IBasketItem[],
    itemToAdd: IBasketItem,
    quantity: number
  ): IBasketItem[] {
    if (items === null) {
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
  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basketId', basket.id);
    return basket;
  }
  private mapProductItemToBasketItem(
    item: IProduct,
    quantity: number
  ): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType,
    };
  }
}
