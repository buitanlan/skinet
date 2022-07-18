import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { AdminRoutingModule } from './admin-routing.module';
import { EditProductFormComponent } from './edit-product-form/edit-product-form.component';
import { EditProductPhotosComponent } from './edit-product-photos/edit-product-photos.component';
import { PhotoWidgetModule } from '../shared/components/photo-widget/photo-widget.module';
import { PagingHeaderModule } from '../shared/components/paging-header/paging-header.module';
import { RouterModule } from '@angular/router';
import { PagerModule } from '../shared/components/pager/pager.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AdminComponent, EditProductComponent, EditProductFormComponent, EditProductPhotosComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    PhotoWidgetModule,
    PagingHeaderModule,
    RouterModule,
    PagerModule,
    CurrencyMaskModule,
    RouterModule,
    TabsModule.forRoot(),
    FormsModule
  ]
})
export class AdminModule {}
