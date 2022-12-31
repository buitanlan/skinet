import { AdminComponent } from './admin.component';
import { Routes } from '@angular/router';
import { EditProductComponent } from './edit-product/edit-product.component';

export const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'create', component: EditProductComponent, data: { breadcrumb: 'Create' } },
  { path: 'edit/:id', component: EditProductComponent, data: { breadcrumb: 'Edit' } }
];
