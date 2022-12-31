import { Routes } from '@angular/router';
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
