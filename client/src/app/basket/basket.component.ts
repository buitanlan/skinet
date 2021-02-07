import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { BasketService } from './basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  basket$: Observable<IBasket>;
  basketTotalPrice$: Observable<IBasketTotals>;

  constructor(private basketService: BasketService) {
  }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
    this.basketTotalPrice$ = this.basketService.basketTotalPrice$;
  }
  removeBasketItem(item: IBasketItem) {
    console.log(item);
    this.basketService.removeItemFromBasket(item);
  }
  decrementItemQuantity(item: IBasketItem) {
    this.basketService.decrementItemQuantity(item);
  }
  incrementItemQuantity(item: IBasketItem) {
    this.basketService.incrementItemQuantity(item);
  }

}
