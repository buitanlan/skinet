import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule,  } from 'ngx-bootstrap/pagination';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { PagerComponent } from './components/pager/pager.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { OrderTotalsComponent } from './components/order-totals/order-totals.component';
import { OrderTatalsComponent } from './components/order-tatals/order-tatals.component';



@NgModule({
  declarations: [PagingHeaderComponent, PagerComponent, OrderTotalsComponent, OrderTatalsComponent],
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    CarouselModule.forRoot()
  ],
  exports: [
    PaginationModule,
    PagingHeaderComponent,
    PagerComponent,
    CarouselModule,
    OrderTotalsComponent
  ]
})
export class SharedModule { }
