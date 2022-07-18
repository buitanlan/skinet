import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout.component';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutAddressComponent } from './checkout-address/checkout-address.component';
import { CheckoutDeliveryComponent } from './checkout-delivery/checkout-delivery.component';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment.component';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';
import { StepperModule } from '../shared/components/stepper/stepper.module';
import { TextInputModule } from '../shared/components/text-input/text-input.module';
import { BasketSummaryModule } from '../shared/components/basket-summary/basket-summary.module';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderTotalsModule } from '../shared/components/order-totals/order-totals.module';
import { CdkStepperModule } from '@angular/cdk/stepper';

@NgModule({
  declarations: [
    CheckoutComponent,
    CheckoutAddressComponent,
    CheckoutDeliveryComponent,
    CheckoutReviewComponent,
    CheckoutPaymentComponent,
    CheckoutSuccessComponent
  ],
  imports: [
    CommonModule,
    StepperModule,
    CheckoutRoutingModule,
    StepperModule,
    TextInputModule,
    BasketSummaryModule,
    ReactiveFormsModule,
    CdkStepperModule,
    OrderTotalsModule
  ]
})
export class CheckoutModule {}
