import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountModule } from './account.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [AccountModule]
})
export class AccountRoutingModule { }
