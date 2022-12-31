import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/shared/services/account.service';
import { BasketService } from 'src/app/shared/services/basket.service';
import { IBasket, IBasketQuantity } from 'src/app/shared/models/basket';
import { IUser } from 'src/app/shared/models/user';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-nav-bar',
  template: `
    <div
      class="d-flex flex-column flex-md-row align-items-center justify-content-between p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm fixed-top"
    >
      <img src="/assets/images/logo.png" style="max-height: 70px" alt="logo" routerLink="/" class="logo" />
      <nav class="my-2 my-md-0 ms-md-3 text-uppercase" style="font-size: larger">
        <a class="p-2" [routerLink]="['/']" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"
          >Home</a
        >
        <a class="p-2" routerLink="/shop" routerLinkActive="active">Shop</a>
        <ng-container *ngIf="isAdmin$ | async">
          <a class="p-2" routerLink="/test-error" routerLinkActive="active">Errors</a>
          <a class="p-2" routerLink="/admin" routerLinkActive="active">Admin</a>
        </ng-container>
      </nav>
      <div class="d-flex align-items-center">
        <a routerLink="/basket" class="position-relative">
          <i class="fas fa-shopping-cart ms-5 text-dark cart"></i>
          <div *ngIf="basket$ | async as basket">
            <div *ngIf="basketTotalQuantity$ | async as totalQuantity" class="cart-no">
              {{ totalQuantity.quantity }}
            </div>
          </div>
        </a>
        <ng-template #loading>
          <a routerLink="/account/login" class="btn btn-outline-secondary ms-2">Login</a>
          <a routerLink="/account/register" class="btn btn-outline-secondary ms-3">Sign up</a>
        </ng-template>

        <ng-container *ngIf="currentUser$ | async as currentUser; else loading">
          <div class="dropdown ms-3 ms-5" dropdown>
            <a class="dropdown-toggle" style="cursor: pointer" dropdownToggle>
              <strong>Welcome {{ currentUser.displayName }}</strong>
            </a>
            <div class="dropdown-menu dropdown-menu-right" style="cursor: pointer" *dropdownMenu>
              <a routerLink="/basket" class="dropdown-item d-flex align-items-center py-2">
                <i class="fas fa-shopping-cart ms-3"></i> View Basket
              </a>
              <a routerLink="/orders" class="dropdown-item d-flex align-items-center py-2">
                <i class="fas fa-history ms-3"></i> View Orders
              </a>
              <div class="dropdown-divider"></div>
              <a (click)="logout()" class="dropdown-item d-flex align-items-center py-2">
                <i class="fas fa-sign-out-alt ms-3"></i> Log Out
              </a>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styleUrls: ['./nav-bar.component.scss'],
  imports: [RouterLink, RouterLinkActive, AsyncPipe, NgIf, BsDropdownModule],
  standalone: true
})
export class NavBarComponent implements OnInit {
  basket$!: Observable<IBasket | null>;
  currentUser$!: Observable<IUser | null>;
  basketTotalQuantity$!: Observable<IBasketQuantity | null>;
  isAdmin$!: Observable<boolean>;

  constructor(private readonly basketService: BasketService, private readonly accountService: AccountService) {}

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
    this.currentUser$ = this.accountService.currentUser$;
    this.basketTotalQuantity$ = this.basketService.basketTotalQuantity$;
    this.isAdmin$ = this.accountService.isAdmin$;
  }
  logout() {
    this.accountService.logout();
  }
}
