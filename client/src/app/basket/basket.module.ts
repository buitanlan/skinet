import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketComponent } from './basket.component';
import { BasketRoutingModule } from './basket-routing.module';
import { BasketSummaryModule } from '../shared/components/basket-summary/basket-summary.module';
import { OrderTotalsModule } from '../shared/components/order-totals/order-totals.module';

@NgModule({
  declarations: [BasketComponent],
  imports: [CommonModule, BasketRoutingModule, BasketSummaryModule, BasketSummaryModule, OrderTotalsModule]
})
export class BasketModule {}
