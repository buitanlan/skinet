import { Routes } from '@angular/router';
import { OrderDetailedComponent } from './order-detailed/order-detailed.component';
import { OrdersComponent } from './orders.component';

export const routes: Routes = [
	{ path: '', component: OrdersComponent },
	{ path: ':id', component: OrderDetailedComponent },
];
