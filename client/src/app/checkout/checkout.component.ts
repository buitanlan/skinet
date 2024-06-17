import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AccountService } from '../shared/services/account.service';
import { BasketService } from '../shared/services/basket.service';
import { IBasketTotals } from '../shared/models/basket';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment.component';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CheckoutDeliveryComponent } from './checkout-delivery/checkout-delivery.component';
import { CheckoutAddressComponent } from './checkout-address/checkout-address.component';
import { StepperComponent } from '../shared/components/stepper/stepper.component';
import { OrderTotalsComponent } from '../shared/components/order-totals/order-totals.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  template: `
    <div class="container mt-5">
      <div class="row">
        <div class="col-8">
          <app-stepper [linearModeSelected]="true" #appStepper>
            <cdk-step [label]="'Address'" [completed]="checkoutForm.get('addressForm')!.valid">
              <app-checkout-address [checkoutForm]="checkoutForm"></app-checkout-address>
            </cdk-step>
            <cdk-step [label]="'Delivery'" [completed]="checkoutForm.get('deliveryForm')!.valid">
              <app-checkout-delivery [checkoutForm]="checkoutForm"></app-checkout-delivery>
            </cdk-step>
            <cdk-step [label]="'Review'">
              <app-checkout-review [appStepper]="appStepper"></app-checkout-review>
            </cdk-step>
            <cdk-step [label]="'Payment'" [completed]="checkoutForm.get('paymentForm')?.valid">
              <app-checkout-payment [checkoutForm]="checkoutForm"></app-checkout-payment>
            </cdk-step>
          </app-stepper>
        </div>
        <div class="col-4">
          <app-order-totals></app-order-totals>
        </div>
      </div>
    </div>
  `,
  imports: [
    CheckoutPaymentComponent,
    CheckoutReviewComponent,
    CdkStepperModule,
    CheckoutDeliveryComponent,
    CheckoutAddressComponent,
    StepperComponent,
    OrderTotalsComponent,
    AsyncPipe
  ],
  standalone: true
})
export class CheckoutComponent implements OnInit {
  private readonly fb = inject(UntypedFormBuilder);
  private readonly accountService = inject(AccountService);
  private readonly basketService = inject(BasketService);
  basketTotalPrice$!: Observable<IBasketTotals | null>;
  checkoutForm!: UntypedFormGroup;

  ngOnInit(): void {
    this.createCheckoutForm();
    this.getAddressFromValues();
    this.getDeliveryMethodValue();
    this.basketTotalPrice$ = this.basketService.basketTotalPrice$;
  }

  createCheckoutForm() {
    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', Validators.required]
      }),
      deliveryForm: this.fb.group({
        deliveryMethod: ['', Validators.required]
      }),
      paymentForm: this.fb.group({
        nameOnCard: ['', Validators.required]
      })
    });
  }

  getAddressFromValues() {
    this.accountService.getUserAddress().subscribe({
      next: (address) => {
        if (address) {
          this.checkoutForm?.get('addressForm')?.patchValue(address);
        }
      },
      error: (err) => console.log(err)
    });
  }

  getDeliveryMethodValue() {
    const basket = this.basketService.getCurrentBasketValue();
    if (basket?.deliveryMethodId) {
      this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.patchValue(basket?.deliveryMethodId?.toString());
    }
  }
}
