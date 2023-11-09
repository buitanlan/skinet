import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-paging-header',
  template: `
    <header>
      @if (totalCount === 0 || pageSize * (pageNumber - 1) > totalCount) {
      <span> There are <strong>0</strong> results for this filters </span>
      } @else { @if (totalCount && totalCount > 0) {
      <span
        >Showing
        <strong>
          {{ pageSize * (pageNumber - 1) + 1 }} -
          {{ pageNumber * pageSize > totalCount ? totalCount : pageNumber * pageSize }}
        </strong>
        of <strong>{{ totalCount }}</strong> results</span
      >
      } }
    </header>
  `,
  imports: [NgIf],
  standalone: true
})
export class PagingHeaderComponent {
  @Input() pageNumber = 1;
  @Input() pageSize = 6;
  @Input() totalCount = 0;

  constructor() {}
}
