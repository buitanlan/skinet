import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/shared/services/basket.service';
import { Basket } from 'src/app/shared/models/basket';
import { OrderToCreate } from 'src/app/shared/models/order';
import { CheckoutService } from '../../shared/services/checkout.service';
import { lastValueFrom } from 'rxjs';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgIf } from '@angular/common';
import {
	StripeCardCvcElement,
	StripeCardExpiryElement,
	StripeCardNumberElement,
	Stripe,
	loadStripe,
} from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout-payment',
  template: `
    <div class="mt-4" *ngIf="checkoutForm" [formGroup]="checkoutForm">
      <div class="row">
        <div class="form-group col-12" formGroupName="paymentForm">
          <app-text-input [label]="'Name on card'" formControlName="nameOnCard"></app-text-input>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-6">
          <div class="form-floating">
            <div class="form-control" #cardNumber></div>
            <label>Card Number</label>
            <span class="text-danger">{{cardErrors}}</span>
          </div>
        </div>
        <div class="col-3">
          <div class="form-floating">
            <div class="form-control" #cardExpiry></div>
            <label>Card Expiry</label>
          </div>
        </div>
        <div class="col-3">
          <div class="form-floating">
            <div class="form-control" #cardCvc></div>
            <label>Card Cvc</label>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-between flex-row mb-5">
      <button class="btn btn-outline-primary" cdkStepperPrevious>
        <i class="fas fa-arrow-left"></i> Back to Review
      </button>

      <button
        [disabled]="
					loading || !paymentFormComplete
				"
        class="btn btn-primary"
        (click)="submitOrder()"
      >
        Submit Order <i class="fas fa-arrow-right"></i>
        <i *ngIf="loading" class="fas fa-spinner fa-spin"></i>
      </button>
    </div>
  `,
  imports: [TextInputComponent, ReactiveFormsModule, CdkStepperModule, NgIf],
  standalone: true
})
export class CheckoutPaymentComponent implements OnInit {
	@Input() checkoutForm!: FormGroup;
	@ViewChild('cardNumber', { static: true }) cardNumberElement!: ElementRef;
	@ViewChild('cardExpiry', { static: true }) cardExpiryElement!: ElementRef;
	@ViewChild('cardCvc', { static: true }) cardCvcElement!: ElementRef;
	stripe: Stripe | null = null;
	cardNumber?: StripeCardNumberElement;
	cardExpiry?: StripeCardExpiryElement;
	cardCvc?: StripeCardCvcElement;
	cardNumberComplete = false;
	cardExpiryComplete = false;
	cardCvcComplete = false;
	cardErrors: any;
	loading = false;

	constructor(
		private readonly basketService: BasketService,
		private readonly checkoutService: CheckoutService,
		private readonly toastr: ToastrService,
		private readonly router: Router,
	) {}

	ngOnInit(): void {
		loadStripe(
			'pk_test_51HgMIsDINKKez9i6TlUBPF7GNwy3ztZVjnlSXn0Kl8vXRq7PqQ0jd00ne6hlyAsE0ZX0UVPUGIvBFKaC3EsZbEho0003KxxGAY',
		).then((stripe) => {
			this.stripe = stripe;
			const elements = stripe?.elements();
			if (elements) {
				this.cardNumber = elements.create('cardNumber');
				this.cardNumber?.mount(this.cardNumberElement?.nativeElement);
				this.cardNumber?.on('change', (event) => {
					this.cardNumberComplete = event.complete;
					if (event.error) this.cardErrors = event.error.message;
					else this.cardErrors = null;
				});

				this.cardExpiry = elements.create('cardExpiry');
				this.cardExpiry.mount(this.cardExpiryElement?.nativeElement);
				this.cardExpiry.on('change', (event) => {
					this.cardExpiryComplete = event.complete;
					if (event.error) this.cardErrors = event.error.message;
					else this.cardErrors = null;
				});

				this.cardCvc = elements.create('cardCvc');
				this.cardCvc.mount(this.cardCvcElement?.nativeElement);
				this.cardCvc.on('change', (event) => {
					this.cardCvcComplete = event.complete;
					if (event.error) this.cardErrors = event.error.message;
					else this.cardErrors = null;
				});
			}
		});
	}

	get paymentFormComplete() {
		return (
			this.checkoutForm?.get('paymentForm')?.valid &&
			this.cardNumberComplete &&
			this.cardExpiryComplete &&
			this.cardCvcComplete
		);
	}

	async submitOrder() {
		this.loading = true;
		const basket = this.basketService.getCurrentBasketValue();
		try {
			if (basket) {
				const createdOrder = await this.createOrder(basket);
				const paymentResult = await this.confirmPaymentWithStripe(basket);

				if (paymentResult.paymentIntent) {
					this.basketService.deleteBasket(basket);
					const navigationExtras: NavigationExtras = { state: createdOrder };
					await this.router.navigate(['checkout/success'], navigationExtras);
				} else {
					this.toastr.error(paymentResult.error.message);
				}
				this.loading = false;
			}
		} catch (error: any) {
			console.error(error);
			this.toastr.error(error.message);
		} finally {
			this.loading = false;
		}
	}

	private async confirmPaymentWithStripe(basket: Basket | null) {
		if (!basket) throw new Error('Basket is null');
		const result = this.stripe?.confirmCardPayment(basket.clientSecret!, {
			payment_method: {
				card: this.cardNumber!,
				billing_details: {
					name: this.checkoutForm?.get('paymentForm')?.get('nameOnCard')?.value,
				},
			},
		});
		if (!result) throw new Error('Problem attempting payment with stripe');
		return result;
	}

	private async createOrder(basket: Basket) {
		const orderToCreate = this.getOrderToCreate(basket);
		return await lastValueFrom(this.checkoutService.createOrder(orderToCreate));
	}

	private getOrderToCreate(basket: Basket) {
		return {
			basketId: basket.id,
			deliveryMethodId: +this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value,
			shipToAddress: this.checkoutForm?.get('addressForm')?.value,
		} as OrderToCreate;
	}
}
