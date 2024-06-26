import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadcrumbComponent, BreadcrumbService } from 'xng-breadcrumb';
import { AsyncPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-section-header',
  template: `
    @if (breadcrumb$ | async; as breadcrumbs) {
      @if (breadcrumbs.length > 0 && breadcrumbs.at(-1).label !== 'Home') {
        <section class="py-5 mb-3" style="margin-top: 105px; background-color: #f5f5f5">
          <div class="container">
            <div class="row d-flex align-items-center">
              <div class="col-9">
                <h1>{{ breadcrumbs.length > 0 && breadcrumbs.at(-1).label | titlecase }}</h1>
              </div>
              <div class="col-3">
                <xng-breadcrumb></xng-breadcrumb>
              </div>
            </div>
          </div>
        </section>
      }
    }
  `,
  imports: [BreadcrumbComponent, AsyncPipe, TitleCasePipe],
  standalone: true
})
export class SectionHeaderComponent implements OnInit {
  private readonly bcService = inject(BreadcrumbService);
  breadcrumb$!: Observable<any[]>;

  ngOnInit(): void {
    this.breadcrumb$ = this.bcService.breadcrumbs$;
  }
}
