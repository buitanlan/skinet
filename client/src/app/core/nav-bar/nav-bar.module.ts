import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NavBarComponent],
  imports: [BsDropdownModule.forRoot(), CommonModule, RouterModule],
  exports: [NavBarComponent]
})
export class NavBarModule {}
