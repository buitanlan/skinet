import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Address } from '../models/address';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
	baseUrl = environment.apiUrl;
	private currentUserSource = new ReplaySubject<User | null>(1);
	currentUser$ = this.currentUserSource.asObservable();
	private isAdminSource = new ReplaySubject<boolean>(1);
	isAdmin$ = this.isAdminSource.asObservable();

	constructor(private readonly http: HttpClient, private router: Router) {}

	loadCurrentUser(token: string | null): Observable<any> {
		if (!token) {
			this.currentUserSource.next(null);
			return of(null);
		}

		return this.http.get<User>(`${this.baseUrl}account`).pipe(
			map((user: User) => {
				if (user) {
					localStorage.setItem('token', user.token);
					this.currentUserSource.next(user);
					this.isAdminSource.next(this.isAdmin(user.token));
				}
			}),
		);
	}

	login(value: any) {
		return this.http.post<User>(this.baseUrl + 'account/login', value).pipe(
			map((user: User) => {
				if (user) {
					localStorage.setItem('token', user.token);
					this.currentUserSource.next(user);
					this.isAdminSource.next(this.isAdmin(user.token));
				}
			}),
		);
	}

	register(value: any) {
		return this.http.post<User>(this.baseUrl + 'account/register', value).pipe(
			map((user: User) => {
				if (user) {
					localStorage.setItem('token', user.token);
					this.currentUserSource.next(user);
				}
			}),
		);
	}

	logout() {
		localStorage.removeItem('token');
		this.currentUserSource.next(null);
		this.isAdminSource.next(false);
		void this.router.navigateByUrl('/');
	}

	checkEmailExists(email: string) {
		return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
	}

	getUserAddress() {
		return this.http.get<Address>(this.baseUrl + 'account/address');
	}

	updateUserAddress(address: Address) {
		return this.http.put<Address>(this.baseUrl + 'account/address', address);
	}

	isAdmin(token: string): boolean {
		if (!token) {
			return false;
		}
		const decodedToken = JSON.parse(atob(token.split('.')[1]));
		return decodedToken.role.indexOf('Admin') > -1;
	}
}
