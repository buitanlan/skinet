import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
import { BasketService } from '../basket/basket.service';
import { IBasketTotals } from '../shared/models/basket';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  basketTotalPrice$!: Observable<IBasketTotals | null>;
  checkoutForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private basketService: BasketService) {}

  ngOnInit(): void {
    this.createCheckoutForm();
    this.getAddressFromValues();
    this.getDeliveryMethodValue();
    this.basketTotalPrice$ = this.basketService.basketTotalPrice$;
   }

  createCheckoutForm(){
    this.checkoutForm = this.fb.group({
      addressForm : this.fb.group({
        firstName : [null, Validators.required],
        lastName : [null, Validators.required],
        street : [null, Validators.required],
        city : [null, Validators.required],
        state : [null, Validators.required],
        zipCode : [null, Validators.required]
      }),
      deliveryForm: this.fb.group({
        deliveryMethod: [null, Validators.required]
      }),
      paymentForm: this.fb.group({
        nameOnCard: [null, Validators.required]
      })
    });
  }

  getAddressFromValues(){
    this.accountService.getUserAddress().subscribe(address => {
      if (address){
        this.checkoutForm?.get('addressForm')?.patchValue(address);
      }
    }, err => {
      console.log(err);
    });
  }

  getDeliveryMethodValue(){
    const basket = this.basketService.getCurrentBasketValue();
    if (basket?.deliveryMethodId !== null)
    {
      this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.patchValue(basket?.deliveryMethodId?.toString());
    }
  }

}
