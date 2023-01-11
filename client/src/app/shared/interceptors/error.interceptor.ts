import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const router = inject(Router);
	const toastr = inject(ToastrService);
	return next(req).pipe(
		catchError((error) => {
			if (error) {
				if (error.status === 400) {
					if (error.error.errors) {
						throw error.error;
					} else {
						toastr.error(error.error.message, error.error.statusCode);
					}
				}
				if (error.status === 401) {
					toastr.error(error.error.message, error.error.statusCode);
				}
				if (error.status === 404) {
					void router.navigateByUrl('/not-found');
				}
				if (error.status === 500) {
					void router.navigateByUrl('/server-error');
				}
			}
			return throwError(error);
		}),
	);
};
