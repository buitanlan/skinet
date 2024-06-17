import { Component, input } from '@angular/core';

@Component({
  selector: 'app-paging-header',

  template: `
    <header>
      @if (totalCount() === 0 || pageSize() * (pageNumber() - 1) > totalCount()) {
        <span> There are <strong>0</strong> results for this filters </span>
      } @else {
        @if (totalCount() && totalCount() > 0) {
          <span
            >Showing
            <strong>
              {{ pageSize() * (pageNumber() - 1) + 1 }} -
              {{ pageNumber() * pageSize() > totalCount() ? totalCount() : pageNumber() * pageSize() }}
            </strong>
            of <strong>{{ totalCount() }}</strong> results</span
          >
        }
      }
    </header>
  `,
  imports: [],
  standalone: true
})
export class PagingHeaderComponent {
  pageNumber = input(1);
  pageSize = input(6);
  totalCount = input(0);
}
