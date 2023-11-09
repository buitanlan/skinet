import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { RouterModule } from '@angular/router';
import { routes } from './app/app.route';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './app/shared/interceptors/error.interceptor';
import { loadingInterceptor } from './app/shared/interceptors/loading.interceptors';
import { jwtInterceptor } from './app/shared/interceptors/jwt.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom([
      BrowserAnimationsModule,
      RouterModule.forRoot(routes),
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-right',
        preventDuplicates: true
      })
    ]),
    provideHttpClient(withInterceptors([errorInterceptor, jwtInterceptor, loadingInterceptor]))
  ]
}).catch(console.error);
