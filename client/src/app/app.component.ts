import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';
import { BasketService } from './basket/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SkiNet';
  constructor(private readonly basketService: BasketService, private readonly accountService: AccountService) {}
  ngOnInit(): void {
    this.loadBasket();
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    const token = localStorage.getItem('token');
    this.accountService.loadCurrentUser(token).subscribe({
      next: () => console.log('load user'),
      error: (error) => console.log(error)
    });
  }

  loadBasket() {
    const basketId = localStorage.getItem('basketId');
    if (basketId) {
      this.basketService.getBasket(basketId).subscribe({
        next: () => console.log('initial basket'),
        error: (error) => console.log(error)
      });
    }
  }
}
