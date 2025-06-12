import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Filter } from './filter';
// import { Specialities } from '../../../../core/enums/speciality.enum';
import { Gender } from '../../../../core/enums/gender.enum';
import { Governorate } from '../../../../core/enums/governorate.enum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as noUiSlider from 'nouislider';
import wNumb from 'wnumb';
import { NgModule } from '@angular/core';
import { NouisliderModule } from 'ng2-nouislider';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { filter } from 'rxjs';
import { DoctorSearchService } from '../../../../core/services/doctor-search.service';
import { SpecialtyService } from '../../../../core/services/specialty.service';
import { Specialty } from '../../../../core/interfaces/specialty.interface';
import { effect } from '@angular/core';
import { response } from 'express';
import { Router } from '@angular/router';
@Component({
  selector: 'app-doctor-filters',
  imports: [CommonModule, FormsModule, NouisliderModule],
  templateUrl: './doctor-filters.component.html',
  styleUrl: './doctor-filters.component.css'
})
export class DoctorFiltersComponent implements OnInit, AfterViewInit {

  public isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: any,
    protected DoctorSearchService: DoctorSearchService,
    private SpecialtyService: SpecialtyService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  @ViewChild('waitSlider', { static: false }) waitSlider!: ElementRef;
  @ViewChild('priceSlider', { static: false }) priceSlider!: ElementRef;

  SpecialitiesList: Specialty[] = [];
  Gender = Gender;



  GovernoratesList = Object.keys(Governorate)
    .filter(key => isNaN(Number(key)))
    .map(key => ({
      name: key,
      value: Governorate[key as keyof typeof Governorate]
    }));
  GenderList = Object.values(Gender);
  filters: Filter = {
    doctorName: '',
    speciality: this.SpecialitiesList,
    governorate: Governorate.All,
    gender: Gender.All,
    waitingTime: 60, // Default waiting time in minutes
    minPrice: 0,
    maxPrice: 1000,
  };
  sliderConfig: any = {};




  pageIndexEffect = effect(() => {
    const pageIndex = this.DoctorSearchService.pageIndex();
    if (typeof pageIndex === 'number' && pageIndex !== this.DoctorSearchService.currentPage() && this.DoctorSearchService.pageIndexSource() == 'filter') {
      this.DoctorSearchService.currentPage.set(pageIndex);
      // this.loadDoctors();
      this.DoctorSearchService.loadDoctors();

      // console.log('Page index changed:', pageIndex);
      // console.log('Current page:', this.currentPage);
    }
  });


  ngOnInit(): void {
    this.loadSpecialities();
    // Initialize filters with service values if they exist
    if (this.DoctorSearchService.speciality().length > 0) {
      this.filters.speciality = [...this.DoctorSearchService.speciality()];
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      console.log(this.GovernoratesList);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log(`spec doc serv state : ---------> ${JSON.stringify(this.DoctorSearchService.speciality())}`);
      // Wait Slider
      if (this.waitSlider && this.waitSlider.nativeElement) {
        noUiSlider.create(this.waitSlider.nativeElement, {
          start: [this.filters.waitingTime ?? 60],
          step: 5,
          connect: "lower",
          range: { min: 0, max: 60 },
          format: wNumb({ decimals: 0 }),
          pips: {
            mode: 'values',
            values: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
            density: 2
          } as any
        });

        this.waitSlider.nativeElement.noUiSlider.on('update', (values: string[]) => {
          this.filters.waitingTime = Number(values[0]);
        });
      }

      // Price Slider
      if (this.priceSlider && this.priceSlider.nativeElement) {
        noUiSlider.create(this.priceSlider.nativeElement, {
          start: [
            this.filters.minPrice ?? 0,
            this.filters.maxPrice ?? 1000
          ],
          step: 10,
          connect: true,
          range: { min: 0, max: 1000 },
          format: wNumb({ decimals: 0 }),
          pips: {
            mode: 'values',
            values: [0, 200, 400, 600, 800, 1000],
            density: 2
          } as any
        });

        this.priceSlider.nativeElement.noUiSlider.on('update', (values: string[]) => {
          this.filters.minPrice = Number(values[0]);
          this.filters.maxPrice = Number(values[1]);
        });
      }


    }

  }




  loadSpecialities(): void {
    this.SpecialtyService.isLoading.set(true);
    this.SpecialtyService.getSpecialties().subscribe({
      next: (response) => {
        this.SpecialitiesList = response;
        this.SpecialtyService.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching doctors:', error);
        this.SpecialtyService.isLoading.set(false);
      }
    });
  }

  onSpecialtyChange(specialtyId: string): void {
    if (!specialtyId) {
      this.filters.speciality = [];
    } else {
      const specialty = this.SpecialitiesList.find(s => s.id.toString() === specialtyId);
      if (specialty) {
        this.filters.speciality = [specialty];
      }
    }
    // this.onFilter();
    this.DoctorSearchService.speciality.set(this.filters.speciality);

  }

  onFilter(): void {
    console.log('Filters applied:', this.filters);
    this.DoctorSearchService.doctorName.set(this.filters.doctorName);
    this.DoctorSearchService.speciality.set(this.filters.speciality);
    this.DoctorSearchService.governorate.set(this.filters.governorate);
    this.DoctorSearchService.gender.set(this.filters.gender);
    this.DoctorSearchService.waitingTime.set(this.filters.waitingTime ?? 60);
    this.DoctorSearchService.minPrice.set(this.filters.minPrice ?? 0);
    this.DoctorSearchService.maxPrice.set(this.filters.maxPrice ?? 1000);
    this.DoctorSearchService.currentPage.set(1);
    this.DoctorSearchService.pageIndexSource.set('filter');
    // this.loadDoctors();
    this.DoctorSearchService.loadDoctors();

  }
  // loadDoctors(): void {
  //   this.DoctorSearchService.isLoading.set(true);
  //   this.DoctorSearchService.doctors.set([]);
  //   this.DoctorSearchService.getFilteredDoctorsWithPagination(this.DoctorSearchService.currentPage()
  //   , this.DoctorSearchService.pageSize()
  //   , this.DoctorSearchService.doctorName()
  //   , this.DoctorSearchService.speciality()
  //   , this.DoctorSearchService.governorate()
  //   , this.DoctorSearchService.gender()
  //   , this.DoctorSearchService.waitingTime()
  //   , this.DoctorSearchService.minPrice()
  //   , this.DoctorSearchService.maxPrice()).subscribe({
  //     next: (response) => {
  //       this.DoctorSearchService.doctors.set(response.results);
  //       console.log('Doctors loaded:', this.DoctorSearchService.doctors());
  //       this.DoctorSearchService.numberOfPages.set(response.total_pages);
  //       console.log('Total pages:', this.DoctorSearchService.numberOfPages());
  //       this.DoctorSearchService.numberOfRecords.set(this.DoctorSearchService.numberOfPages() * this.DoctorSearchService.pageSize());
  //       this.DoctorSearchService.totalDoctors.set(response.total_results);
  //       this.DoctorSearchService.pageIndex.set(response.page);
  //       this.DoctorSearchService.isLoading.set(false);
  //       console.log("Tracing: Doctors loaded:", this.DoctorSearchService.doctors());
  //       console.log("Tracing: Total pages:", this.DoctorSearchService.numberOfPages());
  //       console.log("Tracing: Number of records:", this.DoctorSearchService.numberOfRecords());
  //       console.log("Tracing: Total doctors:", this.DoctorSearchService.totalDoctors());
  //       console.log("Tracing: Current page index:", this.DoctorSearchService.pageIndex());

  //     },
  //     error: (error) => {
  //       console.error('Error fetching doctors:', error);
  //       this.DoctorSearchService.isLoading.set(false);
  //     }
  //   });
  // }
  isDefaultFilters(): boolean {
    const defaultFilters: Filter = {
      doctorName: '',
      speciality: [],
      governorate: Governorate.All,
      gender: Gender.All,
      waitingTime: 60,
      minPrice: 0,
      maxPrice: 1000
    };
    return (
      this.filters.doctorName === defaultFilters.doctorName &&
      this.filters.speciality === defaultFilters.speciality &&
      this.filters.governorate === defaultFilters.governorate &&
      this.filters.gender === defaultFilters.gender &&
      this.filters.waitingTime === defaultFilters.waitingTime &&
      this.filters.minPrice === defaultFilters.minPrice &&
      this.filters.maxPrice === defaultFilters.maxPrice
    );
  }

  onReset(): void {
    const defaultFilters: Filter = {
      doctorName: '',
      speciality: [],
      governorate: Governorate.All,
      gender: Gender.All,
      waitingTime: 60,
      minPrice: 0,
      maxPrice: 1000
    };

    if (!this.isDefaultFilters()) {
      this.filters = { ...defaultFilters };
      this.onFilter();
    }
  }
}
