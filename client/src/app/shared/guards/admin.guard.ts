import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '../services/account.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.accountService.isAdmin$.pipe(
      map((admin) => {
        if (!admin) {
          void this.router.navigateByUrl('/');
        }
        return admin;
      })
    );
  }
}
