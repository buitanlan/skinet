import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { BasketSummaryComponent } from '../../shared/components/basket-summary/basket-summary.component';
import { AsyncPipe } from '@angular/common';
import { BasketService } from '../../shared/services/basket.service';
import { Basket } from '../../shared/models/basket';

@Component({
  selector: 'app-checkout-review',
  template: `
    <div class="container mt-4">
      <app-basket-summary [isBasket]="false" [items]="(basket$ | async)?.items"></app-basket-summary>
    </div>
    <div class="float-none d-flex justify-content-between flex-column flex-lg-row mb-5">
      <button class="btn btn-outline-primary" cdkStepperPrevious>
        <i class="fas fa-arrow-left"> </i> Back to Delivery
      </button>

      <button class="btn btn-primary" (click)="createPaymentIntent()">
        Go to Payment <i class="fas fa-arrow-right"></i>
      </button>
    </div>
  `,
  imports: [CdkStepperModule, BasketSummaryComponent, AsyncPipe],
  standalone: true
})
export class CheckoutReviewComponent implements OnInit {
  @Input() appStepper!: CdkStepper;
  basket$!: Observable<Basket | null>;

  constructor(
    private readonly basketService: BasketService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
  }

  createPaymentIntent() {
    return this.basketService.createPaymentIntent().subscribe({
      next: () => {
        this.toastr.success('Payment intent created');
        this.appStepper.next();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.message);
      }
    });
  }
}
