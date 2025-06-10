import { Component } from '@angular/core';
import { DoctorCardComponent } from "../doctor-card/doctor-card.component";
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Doctor } from '../../../../core/interfaces/doctor';
import Aos from 'aos';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { PaginationComponent } from "../../../shared/pagination/pagination.component";
import { DoctorSearchService } from '../../../../core/services/doctor-search.service';
import { signal, effect } from '@angular/core';

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
  ngOnInit() {
    if(this.isBrowser) {
      // Load AOS only in the browser
      this.DoctorSearchService.isLoading.set(false);
      Aos.init({
        duration: 1000,
        easing: 'ease-out-back',
        offset: 50,
        once: false
      });

      this.DoctorSearchService.pageIndexSource.set('list');
      this.loadDoctors();
    }
  }


  // pageSize: number = 6;
  // pageIndexParent = signal(1);

  pageIndexEffect = effect(() => {
    const pageIndex = this.DoctorSearchService.pageIndex();
    if (typeof pageIndex === 'number' && pageIndex !== this.DoctorSearchService.currentPage() && this.DoctorSearchService.pageIndexSource() == 'list') {
      this.DoctorSearchService.currentPage.set(pageIndex);
      this.loadDoctors();
      // console.log('Page index changed:', pageIndex);
      // console.log('Current page:', this.currentPage);
    }
  });

  loadDoctors(): void {
    this.DoctorSearchService.isLoading.set(true);
    this.DoctorSearchService.doctors.set([]);
    this.DoctorSearchService.getAllDoctorsWithPagination(this.DoctorSearchService.currentPage(), this.DoctorSearchService.pageSize()).subscribe({
      next: (response) => {
        this.DoctorSearchService.doctors.set(response.results);
        console.log('Doctors loaded:', this.DoctorSearchService.doctors());
        this.DoctorSearchService.numberOfPages.set(response.total_pages);
        console.log('Total pages:', this.DoctorSearchService.numberOfPages());
        this.DoctorSearchService.numberOfRecords.set(this.DoctorSearchService.numberOfPages() * this.DoctorSearchService.pageSize());
        this.DoctorSearchService.totalDoctors.set(response.total_results);
        this.DoctorSearchService.pageIndex.set(response.page);
        this.DoctorSearchService.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching movies:', error);
        this.DoctorSearchService.isLoading.set(false);
      }
      
    });
  }

}