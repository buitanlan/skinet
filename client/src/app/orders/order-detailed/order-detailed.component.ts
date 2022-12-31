import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from 'src/app/shared/models/order';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrdersService } from '../../shared/services/orders.service';
import { BasketSummaryComponent } from '../../shared/components/basket-summary/basket-summary.component';
import { OrderTotalsComponent } from '../../shared/components/order-totals/order-totals.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-order-detailed',
  template: `
    <div class="container mt-5">
      <div class="row" *ngIf="order">
        <div class="col-8">
          <app-basket-summary [items]="order.orderItems" [isBasket]="false" [isOrder]="true"></app-basket-summary>
        </div>
        <div class="col-4">
          <app-order-totals [shippingPrice]="order.shippingPrice" [subtotal]="order.subtotal" [total]="order.total">
          </app-order-totals>
        </div>
      </div>
    </div>
  `,
  imports: [BasketSummaryComponent, OrderTotalsComponent, NgIf],
  standalone: true
})
export class OrderDetailedComponent implements OnInit {
	order = {} as IOrder;

	constructor(
		private readonly route: ActivatedRoute,
		private breadcrumbService: BreadcrumbService,
		private readonly ordersService: OrdersService,
	) {
		this.breadcrumbService.set('@OrderDetailed', '');
	}

	ngOnInit(): void {
		this.ordersService.getOrderDetailed(Number(this.route.snapshot.paramMap.get('id'))).subscribe({
			next: (order: IOrder) => {
				this.order = order;
				this.breadcrumbService.set('@OrderDetailed', `Order# ${order.id} - ${order.status}`);
			},
			error: (error) => {
				console.log(error);
			},
		});
	}
}
