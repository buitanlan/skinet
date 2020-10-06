import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { SharedModule } from '../shared/shared.module';
import { ProductsDetailsComponent } from './products-details/products-details.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [ShopComponent, ProductItemComponent, ProductsDetailsComponent],
  imports: [CommonModule, SharedModule, RouterModule],
  exports: [ShopComponent, ProductsDetailsComponent],
})
export class ShopModule {}
