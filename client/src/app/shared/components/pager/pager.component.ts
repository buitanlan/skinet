import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss'],
})

export class PagerComponent implements OnInit {
  @Input() totalCount: number;
  @Input() pageSize: number;
  @Input() pageIndex: number;
  currentPage = 1;
  @Output() pageChanged = new EventEmitter<number>();
  constructor() {}
  ngOnInit(): void {
    this.currentPage = this.pageIndex;
  }
  onPaperChange(event: any) {
    this.pageChanged.emit(event.page);
  }
}
