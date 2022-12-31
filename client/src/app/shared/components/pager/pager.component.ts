import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pager',
  template: `
    <pagination
      [boundaryLinks]="true"
      [totalItems]="totalCount"
      [(ngModel)]="pageIndex"
      (pageChanged)="onPaperChange($event)"
      [itemsPerPage]="this.pageSize"
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
  @Input() totalCount!: number;
  @Input() pageSize!: number;
  @Input() pageIndex!: number;
  @Output() pageChanged = new EventEmitter<number>();
  constructor() {}
  onPaperChange(event: any) {
    this.pageChanged.emit(event.page);
  }
}
