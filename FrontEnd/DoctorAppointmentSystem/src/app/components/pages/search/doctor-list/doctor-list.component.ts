import { Component, effect } from '@angular/core';
import { DoctorCardComponent } from "../doctor-card/doctor-card.component";
import { CommonModule } from '@angular/common';
import Aos from 'aos';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { PaginationComponent } from "../../../shared/pagination/pagination.component";
import { DoctorSearchService } from '../../../../core/services/doctor-search.service';
@Component({
  selector: 'app-doctor-list',
  imports: [DoctorCardComponent, CommonModule, NgbPaginationModule, PaginationComponent],
  templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.css'
})

export class DoctorListComponent {
  public isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) private platformId: any, protected DoctorSearchService: DoctorSearchService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  pageIndexEffect = effect(() => {
    const pageIndex = this.DoctorSearchService.pageIndex();
    if (typeof pageIndex === 'number' && pageIndex !== this.DoctorSearchService.currentPage() && this.DoctorSearchService.pageIndexSource() == 'list') {
      this.DoctorSearchService.currentPage.set(pageIndex);
      // this.loadDoctors();
      if(this.isBrowser)
        window.scrollTo({ top: 0, behavior: 'smooth' });
      this.DoctorSearchService.loadDoctors();

      // console.log('Page index changed:', pageIndex);
      // console.log('Current page:', this.currentPage);
    }
  });
  ngOnInit() {
    if (this.isBrowser) {
      // Load AOS only in the browser
      

      this.DoctorSearchService.isLoading.set(false);
      Aos.init({
        duration: 1000,
        easing: 'ease-out-back',
        offset: 30,
        once: false,
        disable:false
      });
      this.DoctorSearchService.pageIndexSource.set('list');
      this.DoctorSearchService.loadDoctors();
    }
  }
}