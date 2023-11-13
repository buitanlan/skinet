import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CheckoutService } from '../../shared/services/checkout.service';
import { CurrencyPipe, NgForOf } from '@angular/common';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { DeliveryMethod } from '../../shared/models/deliveryMethod';
import { BasketService } from '../../shared/services/basket.service';

@Component({
  selector: 'app-checkout-delivery',
  template: `
    <div class="mt-4" [formGroup]="checkoutForm">
      <h4 class="mb-3">Choose your delivery mothod</h4>
      <div class="row me-5" formGroupName="deliveryForm">
        @for (method of deliveryMethods; track method) {
          <div class="col-6 form-group">
            <input
              type="radio"
              id="{{ method.id }}"
              (click)="setShippingPrice(method)"
              value="{{ method.id }}"
              formControlName="deliveryMethod"
              class="custom-control-input"
            />
            <label for="{{ method.id }}" class="custom-control-label">
              <strong>{{ method.shortName }} - {{ method.price | currency }}</strong>
              <br />
              <span class="label-description">{{ method.description }}</span>
            </label>
          </div>
        }
      </div>
    </div>
    <div class="float-none d-flex justify-content-between flex-column flex-lg-row mb-5">
      <button class="btn btn-outline-primary" cdkStepperPrevious>
        <i class="fas fa-arrow-left"></i> Back to Address
      </button>

      <button class="btn btn-primary" cdkStepperNext>Go to Review <i class="fas fa-arrow-right"></i></button>
    </div>
  `,
  imports: [ReactiveFormsModule, CurrencyPipe, NgForOf, CdkStepperModule],
  standalone: true
})
export class CheckoutDeliveryComponent implements OnInit {
  @Input() checkoutForm!: FormGroup;
  deliveryMethods = [] as DeliveryMethod[];

  constructor(
    private readonly checkoutService: CheckoutService,
    private readonly basketService: BasketService
  ) {}

  ngOnInit(): void {
    this.checkoutService.getDeliveryMethod().subscribe({
      next: (dm: DeliveryMethod[]) => (this.deliveryMethods = dm),
      error: (err) => console.log(err)
    });
  }

  setShippingPrice(deliveryMethod: DeliveryMethod) {
    this.basketService.setShippingPrice(deliveryMethod);
  }
}
