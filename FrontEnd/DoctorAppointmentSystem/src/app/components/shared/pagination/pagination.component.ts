import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  imports: [ CommonModule, NgbPaginationModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() numberOfRecords: number = 0;

  @Output() pageIndexChange = new EventEmitter<number>();

  pageIndex: number = 1;

  pageSize: number = 6;

  onPageChange(newIndex: number) {
    this.pageIndexChange.emit(newIndex);
  }
}
