import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener } from '@angular/core';
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
  maxSize: number = 5;  // Default maxSize

  constructor() {
    this.updateMaxSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateMaxSize();
  }

  private updateMaxSize() {
    if(window.innerWidth > 576)
      this.maxSize = 5
    else if(window.innerWidth < 576 && window.innerWidth > 370)
      this.maxSize = 3  // Change to 3 on small screens
    else if (window.innerWidth < 370)
      this.maxSize = 2
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentPage']) {
      this.pageIndex = this.currentPage;
    }
  }

  onPageChange(newIndex: number) {
    this.pageIndexChange.emit(newIndex);
  }
}
