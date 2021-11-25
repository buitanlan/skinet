import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { SharedModule } from '../shared/shared.module';
import { ProductsDetailsComponent } from './products-details/products-details.component';
import { RouterModule } from '@angular/router';
import { ShopRoutingModule } from './shop-routing.module';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [ShopComponent, ProductItemComponent, ProductsDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ShopRoutingModule,
    FormsModule
  ],
})
export class ShopModule {}
