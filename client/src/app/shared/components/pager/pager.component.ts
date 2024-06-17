import { Component, input, output } from '@angular/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pager',

  template: `
    <pagination
      [boundaryLinks]="true"
      [totalItems]="totalCount()"
      [(ngModel)]="pageIndex"
      (pageChanged)="onPaperChange($event)"
      [itemsPerPage]="this.pageSize()"
      previousText="&lsaquo;"
      nextText="&rsaquo;"
      firstText="&laquo;"
      lastText="&raquo;"
    >
    </pagination>
  `,
  imports: [PaginationModule, FormsModule],
  standalone: true
})
export class PagerComponent {
  totalCount = input.required<number>();
  pageSize = input.required<number>();
  pageIndex = input.required<number>();
  pageChanged = output<number>();

  onPaperChange(event: any) {
    this.pageChanged.emit(event.page);
  }
}
