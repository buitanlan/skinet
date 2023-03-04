import { Component, OnInit } from '@angular/core';
import { AccountService } from './shared/services/account.service';
import { BasketService } from './shared/services/basket.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NavBarComponent } from './shared/components/nav-bar/nav-bar.component';
import { RouterOutlet } from '@angular/router';
import { SectionHeaderComponent } from './shared/components/section-header/section-header.component';

@Component({
  selector: 'app-root',
  template: `
    <ngx-spinner>
      <h3>Loading...</h3>
    </ngx-spinner>
    <app-nav-bar></app-nav-bar>
    <app-section-header></app-section-header>

    <router-outlet></router-outlet>
  `,
  imports: [NgxSpinnerModule, NavBarComponent, RouterOutlet, SectionHeaderComponent],
  standalone: true
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
			error: (error) => console.log(error),
		});
	}

	loadBasket() {
		const basketId = localStorage.getItem('basketId');
		if (basketId) {
			this.basketService.getBasket(basketId).subscribe({
				next: () => console.log('initial basket'),
				error: (error) => console.log(error),
			});
		}
	}
}
