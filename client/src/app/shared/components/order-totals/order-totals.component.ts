import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-order-totals',
  templateUrl: './order-totals.component.html',
  styleUrls: ['./order-totals.component.scss']
})
export class OrderTotalsComponent implements OnInit {
  @Input() shippingPrice = 0;
  @Input() subtotal = 0;
  @Input() total = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
