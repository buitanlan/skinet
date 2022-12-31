import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '../services/account.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
	constructor(private readonly accountService: AccountService, private readonly router: Router) {}

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return this.accountService.isAdmin$.pipe(
			map((admin) => {
				if (!admin) {
					void this.router.navigateByUrl('/');
				}
				return admin;
			}),
		);
	}
}
