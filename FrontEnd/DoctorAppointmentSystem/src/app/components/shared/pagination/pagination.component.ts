import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  imports: [ CommonModule, NgbPaginationModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnChanges {
  @Input() numberOfRecords: number = 0;
  @Input() currentPage: number = 1;

  @Output() pageIndexChange = new EventEmitter<number>();

  pageIndex: number = 1;

  pageSize: number = 6;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentPage']) {
      this.pageIndex = this.currentPage;
    }
  }

  onPageChange(newIndex: number) {
    this.pageIndexChange.emit(newIndex);
  }
}
