import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/account/account.service';
import { IAddress } from 'src/app/shared/models/address';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})
export class CheckoutAddressComponent  {
  @Input() checkoutForm!: UntypedFormGroup;

  constructor(private readonly accountService: AccountService, private readonly toastr: ToastrService) {

  }

  saveUserAddress() {
    this.accountService.updateUserAddress(this.checkoutForm.get('addressForm')?.value).subscribe({
      next: (address: IAddress) => {
        this.toastr.success('Address saved');
        this.checkoutForm.get('addressForm')?.reset(address);
      },
      error: err => {
        this.toastr.error(err.message);
      }
    });
  }

}
