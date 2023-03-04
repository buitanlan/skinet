import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/shared/services/account.service';
import { Address } from 'src/app/shared/models/address';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout-address',
  template: `
    <div class="mt-4" [formGroup]="checkoutForm">
      <div class="d-flex justify-content-between align-items-center">
        <h4>Shipping address</h4>
        <button
          (click)="saveUserAddress()"
          [disabled]="!checkoutForm.get('addressForm')?.valid || !checkoutForm.get('addressForm')?.dirty"
          class="btn btn-outline-success mb-3"
        >
          Save as default address
        </button>
      </div>
      <div class="row" formGroupName="addressForm">
        <div class="form-group col-6">
          <app-text-input [label]="'First Name'" formControlName="firstName"></app-text-input>
        </div>
        <div class="form-group col-6">
          <app-text-input [label]="'Last Name'" formControlName="lastName"></app-text-input>
        </div>
        <div class="form-group col-6">
          <app-text-input [label]="'Street'" formControlName="street"></app-text-input>
        </div>
        <div class="form-group col-6">
          <app-text-input [label]="'City'" formControlName="city"></app-text-input>
        </div>
        <div class="form-group col-6">
          <app-text-input [label]="'State'" formControlName="state"></app-text-input>
        </div>
        <div class="form-group col-6">
          <app-text-input [label]="'ZipCode'" formControlName="zipCode"></app-text-input>
        </div>
      </div>
    </div>
    <div class="float-none d-flex justify-content-between flex-column flex-lg-row mb-5">
      <button class="btn btn-outline-primary" routerLink="/basket/">
        <i class="fas fa-arrow-left"></i> Back to Basket
      </button>

      <button [disabled]="checkoutForm.get('addressForm')?.invalid" class="btn btn-primary" cdkStepperNext>
        Go to Delivery <i class="fas fa-arrow-right"></i>
      </button>
    </div>
  `,
  imports: [TextInputComponent, ReactiveFormsModule, CdkStepperModule, RouterLink],
  standalone: true
})
export class CheckoutAddressComponent {
	@Input() checkoutForm!: FormGroup;

	constructor(private readonly accountService: AccountService, private readonly toastr: ToastrService) {}

	saveUserAddress() {
		this.accountService.updateUserAddress(this.checkoutForm.get('addressForm')?.value).subscribe({
			next: (address: Address) => {
				this.toastr.success('Address saved');
				this.checkoutForm.get('addressForm')?.reset(address);
			},
			error: (err) => {
				this.toastr.error(err.message);
			},
		});
	}
}
