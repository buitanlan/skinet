import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from 'src/app/shared/models/order';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss']
})
export class OrderDetailedComponent implements OnInit {
  order = {} as IOrder;

  constructor(private readonly route: ActivatedRoute, private breadcrumbService: BreadcrumbService, private readonly ordersService: OrdersService) {
    this.breadcrumbService.set('@OrderDetailed', '');
  }

  ngOnInit(): void {
    this.ordersService.getOrderDetailed(Number(this.route.snapshot.paramMap.get('id')))
      .subscribe({
        next: (order: IOrder) => {
          this.order = order;
          this.breadcrumbService.set('@OrderDetailed', `Order# ${order.id} - ${order.status}`);
        },
        error: error => {
          console.log(error);
        }
      });
  }

}
