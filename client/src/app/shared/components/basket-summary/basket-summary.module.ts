import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketComponent } from '../../../basket/basket.component';
import { BasketSummaryComponent } from './basket-summary.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BasketSummaryComponent],
  imports: [CommonModule, RouterModule],
  exports: [BasketSummaryComponent]
})
export class BasketSummaryModule {}
