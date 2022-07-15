import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket, IBasketQuantity } from 'src/app/shared/models/basket';
import { IUser } from 'src/app/shared/models/user';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
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
