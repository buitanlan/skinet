import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs/operators';
import { BusyService } from '../services/busy.service';
import { HttpInterceptorFn } from '@angular/common/http';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
	const busyService = inject(BusyService);
	if (req.method === 'POST' && req.url.includes('orders'))
		if (req.url.includes('emailexists')) {
			return next(req);
		}
	return next(req).pipe(
		delay(300),
		finalize(() => {
			busyService.idle();
		}),
	);
};
