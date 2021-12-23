import { Component, Input } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent{
  @Input() product = {} as IProduct;
  constructor(private readonly basketService: BasketService) { }

  addItemToBasket() {
    this.basketService.addItemToBasket(this.product);
  }

}
