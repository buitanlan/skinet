import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders.component';
import { OrderDetailedComponent } from './order-detailed/order-detailed.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { BasketSummaryModule } from '../shared/components/basket-summary/basket-summary.module';
import { OrderTotalsModule } from '../shared/components/order-totals/order-totals.module';

@NgModule({
  declarations: [OrdersComponent, OrderDetailedComponent],
  imports: [CommonModule, OrdersRoutingModule, BasketSummaryModule, OrderTotalsModule]
})
export class OrdersModule {}
