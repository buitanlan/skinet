import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { ToastrModule } from 'ngx-toastr';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { jwtInterceptor } from './shared/interceptors/jwt.interceptor';
import { loadingInterceptor } from './shared/interceptors/loading.interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom([
      BrowserAnimationsModule,
      RouterModule.forRoot(routes),
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-right',
        preventDuplicates: true
      })
    ]),
    provideHttpClient(withFetch(), withInterceptors([errorInterceptor, jwtInterceptor, loadingInterceptor]))
  ]
}
