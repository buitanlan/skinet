import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { SectionHeaderComponent } from './section-header.component';

@NgModule({
  declarations: [SectionHeaderComponent],
  imports: [CommonModule, BreadcrumbModule],
  exports: [SectionHeaderComponent]
})
export class SectionHeaderModule {}
