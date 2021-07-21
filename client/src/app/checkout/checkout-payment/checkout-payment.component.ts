import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrder, IOrderToCreate } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';

declare var Stripe: (arg0: string) => any;

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() checkoutForm!: FormGroup;
  @ViewChild('cardNumber', {static: true}) cardNumberElement!: ElementRef;
  @ViewChild('cardExpiry', {static: true}) cardExpiryElement!: ElementRef;
  @ViewChild('cardCvc', {static: true}) cardCvcElement!: ElementRef;
  stripe: any;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardErrors: any;
  cardHandler = this.onChange.bind(this);
  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router) { }

  ngAfterViewInit(): void {
    this.stripe = Stripe('pk_test_51HgMIsDINKKez9i6TlUBPF7GNwy3ztZVjnlSXn0Kl8vXRq7PqQ0jd00ne6hlyAsE0ZX0UVPUGIvBFKaC3EsZbEho0003KxxGAY');
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

  onChange({error}: any){
    if (error) {
      this.cardErrors = error.message;
    } else {
      this.cardErrors = null;
    }
  }
  submitOrder(){
    const basket = this.basketService.getCurrentBasketValue();
    if (basket?.id) {
      const orderToCreate = this.getOrderToCreate(basket);

      this.checkoutService.createOrder(orderToCreate).subscribe((order: IOrderToCreate) => {
        this.toastr.success('Order created successfully');
        this.stripe.confirmCardPayment(basket.clientSecret, {
          payment_method: {
            card: this.cardNumber,
            billing_details: {
              name: this.checkoutForm?.get('paymentForm')?.get('nameOnCard')?.value
            }
          }
        }).then((result: any) => {
          console.log(result);
          if (result.paymentIntent) {
            this.basketService.deleteLocalBasket(basket.id);
            const navigationExtras: NavigationExtras = { state: order };
            this.router.navigate(['checkout/success'], navigationExtras);
          } else {
            this.toastr.error('Payment error');
          }
        });
      }, error => {
        this.toastr.error(error.message);
        console.log(error);
      });
    }
  }

  private getOrderToCreate(basket: IBasket) {
      const orderToCreate = {
        basketId: basket.id,
        deliveryMethodId: + this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value,
        shipToAddress: this.checkoutForm?.get('addressForm')?.value
      } as IOrderToCreate;
      return orderToCreate;
  }

}
