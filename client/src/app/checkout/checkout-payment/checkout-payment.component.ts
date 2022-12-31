import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/shared/services/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrderToCreate } from 'src/app/shared/models/order';
import { CheckoutService } from '../../shared/services/checkout.service';
import { lastValueFrom } from 'rxjs';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgIf } from '@angular/common';

declare var Stripe: (arg0: string) => any;

@Component({
  selector: 'app-checkout-payment',
  template: `
    <div class="mt-4" [formGroup]="checkoutForm">
      <div class="row">
        <div class="form-group col-12" formGroupName="paymentForm">
          <app-text-input [label]="'Name on card'" formControlName="nameOnCard"></app-text-input>
        </div>
        <div class="form-group col-6">
          <div #cardNumber id="cardNumber" class="form-control py-3"></div>
          <ng-container *ngIf="cardErrors">
            <span class="text-danger">{{ cardErrors }}</span>
          </ng-container>
        </div>
        <div class="form-group col-3">
          <div #cardExpiry class="form-control py-3"></div>
        </div>
        <div class="form-group col-3">
          <div #cardCvc class="form-control py-3"></div>
        </div>
      </div>
    </div>
    <div class="float-none d-flex justify-content-between flex-column flex-lg-row mb-5">
      <button class="btn btn-outline-primary" cdkStepperPrevious>
        <i class="fas fa-arrow-left"></i> Back to Review
      </button>

      <button
        [disabled]="
					loading || checkoutForm.get('paymentForm')?.invalid || !cardNumberValid || !cardExpiryValid || !cardCvcValid
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
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
	@Input() checkoutForm!: UntypedFormGroup;
	@ViewChild('cardNumber', { static: true }) cardNumberElement!: ElementRef;
	@ViewChild('cardExpiry', { static: true }) cardExpiryElement!: ElementRef;
	@ViewChild('cardCvc', { static: true }) cardCvcElement!: ElementRef;
	stripe: any;
	cardNumber: any;
	cardExpiry: any;
	cardCvc: any;
	cardErrors: any;
	loading = false;
	cardHandler = this.onChange.bind(this);
	cardNumberValid = false;
	cardExpiryValid = false;
	cardCvcValid = false;

	constructor(
		private readonly basketService: BasketService,
		private readonly checkoutService: CheckoutService,
		private readonly toast: ToastrService,
		private readonly router: Router,
	) {}

	ngAfterViewInit(): void {
		this.stripe = Stripe(
			'pk_test_51HgMIsDINKKez9i6TlUBPF7GNwy3ztZVjnlSXn0Kl8vXRq7PqQ0jd00ne6hlyAsE0ZX0UVPUGIvBFKaC3EsZbEho0003KxxGAY',
		);
		const elements = this.stripe.elements();

		this.cardNumber = elements.create('cardNumber');
		this.cardNumber.mount(this.cardNumberElement.nativeElement);
		this.cardNumber.addEventListener('change', this.cardHandler);

		this.cardExpiry = elements.create('cardExpiry');
		this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
		this.cardExpiry.addEventListener('change', this.cardHandler);

		this.cardCvc = elements.create('cardCvc');
		this.cardCvc.mount(this.cardCvcElement.nativeElement);
		this.cardExpiry.addEventListener('change', this.cardHandler);
	}

	ngOnDestroy(): void {
		this.cardNumber.destroy();
		this.cardCvc.destroy();
		this.cardExpiry.destroy();
	}

	onChange(event: any) {
		if (event.error) {
			this.cardErrors = event.error.message;
		} else {
			this.cardErrors = null;
		}

		switch (event.elementType) {
			case 'cardNumber':
				this.cardNumberValid = event.complete;
				break;
			case 'cardExpiry':
				this.cardExpiryValid = event.complete;
				break;
			case 'cardCvc':
				this.cardCvcValid = event.complete;
				break;
		}
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
					this.toast.error(paymentResult.error.message);
				}
				this.loading = false;
			}
		} catch (error) {
			console.log(error);
			this.loading = false;
		}
	}

	private async confirmPaymentWithStripe(basket: IBasket) {
		return this.stripe.confirmCardPayment(basket.clientSecret, {
			payment_method: {
				card: this.cardNumber,
				billing_details: {
					name: this.checkoutForm?.get('paymentForm')?.get('nameOnCard')?.value,
				},
			},
		});
	}

	private async createOrder(basket: IBasket) {
		const orderToCreate = this.getOrderToCreate(basket);
		return await lastValueFrom(this.checkoutService.createOrder(orderToCreate));
	}

	private getOrderToCreate(basket: IBasket) {
		return {
			basketId: basket.id,
			deliveryMethodId: +this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value,
			shipToAddress: this.checkoutForm?.get('addressForm')?.value,
		} as IOrderToCreate;
	}
}
