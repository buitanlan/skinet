import { Routes } from '@angular/router';
import { AdminGuard } from './shared/guards/admin.guard';
import { AuthGuard } from './shared/guards/auth.guard';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ServerErrorComponent } from './shared/components/server-error/server-error.component';
import { TestErrorComponent } from './shared/components/test-error/test-error.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.route').then((r) => r.routes),
    data: { breadcrumb: 'Home' }
  },
  {
    path: 'test-error',
    component: TestErrorComponent,
    data: { breadcrumb: 'Test Errors' }
  },
  {
    path: 'server-error',
    component: ServerErrorComponent,
    data: { breadcrumb: 'Server Errors' }
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    data: { breadcrumb: 'Not Found' }
  },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.route').then((r) => r.routes),
    data: { breadcrumb: 'Shop' }
  },
  {
    path: 'basket',
    loadChildren: () => import('./basket/basket.route').then((r) => r.routes),
    data: { breadcrumb: 'Basket' }
  },
  {
    path: 'checkout',
    canActivate: [AuthGuard],
    loadChildren: () => import('./checkout/checkout.route').then((r) => r.routes),
    data: { breadcrumb: 'Checkout' }
  },
  {
    path: 'orders',
    canActivate: [AuthGuard],
    loadChildren: () => import('./orders/orders.route').then((r) => r.routes),
    data: { breadcrumb: 'Orders' }
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.route').then((r) => r.routes),
    data: { breadcrumb: { skip: true } }
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () => import('./admin/admin.route').then((r) => r.routes),
    data: { breadcrumb: 'Admin' }
  }
];
