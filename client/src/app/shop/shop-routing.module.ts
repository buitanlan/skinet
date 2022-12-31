import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop.component';
import { ProductsDetailsComponent } from './products-details/products-details.component';

export const routes: Routes = [
  { path: '', component: ShopComponent },
  { path: 'page/:page', component: ShopComponent },

  {
    path: ':id',
    component: ProductsDetailsComponent,
    data: { breadcrumb: { alias: 'productDetails' } }
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule {}
