import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { ProductsDetailsComponent } from './products-details/products-details.component';
import { RouterModule } from '@angular/router';
import { ShopRoutingModule } from './shop-routing.module';
import { FormsModule } from '@angular/forms';
import { PagingHeaderModule } from '../shared/components/paging-header/paging-header.module';
import { PagerModule } from '../shared/components/pager/pager.module';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';

@NgModule({
  declarations: [ShopComponent, ProductItemComponent, ProductsDetailsComponent],
  imports: [
    CommonModule,
    RouterModule,
    ShopRoutingModule,
    FormsModule,
    PagingHeaderModule,
    PagerModule,
    NgxGalleryModule
  ]
})
export class ShopModule {}
