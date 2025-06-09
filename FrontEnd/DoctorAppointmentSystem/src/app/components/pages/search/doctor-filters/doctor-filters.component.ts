import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Filter } from './filter';
import { Specialities } from '../../../../core/enums/speciality.enum';
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

@Component({
  selector: 'app-doctor-filters',
  imports: [CommonModule, FormsModule, NouisliderModule],
  templateUrl: './doctor-filters.component.html',
  styleUrl: './doctor-filters.component.css'
})
export class DoctorFiltersComponent implements AfterViewInit {

  @ViewChild('waitSlider', { static: false }) waitSlider!: ElementRef;
  @ViewChild('priceSlider', { static: false }) priceSlider!: ElementRef;

  Gender = Gender;

  SpecialitiesList = Object.values(Specialities);
  GovernoratesList = Object.keys(Governorate)
    .filter(key => isNaN(Number(key)))
    .map(key => ({
      name: key,
      value: Governorate[key as keyof typeof Governorate]
    }));
  GenderList = Object.values(Gender);
  filters: Filter = {
    doctorName: '',
    speciality: Specialities.All,
    governorate: Governorate.All,
    gender: Gender.All,
    waitingTime: 60, // Default waiting time in minutes
    minPrice: 0,
    maxPrice: 1000,
  };
 sliderConfig:any = {};


 public isBrowser: boolean;
  // loading: boolean = false;
  // doctors: any[] = [];
  // currentPage: number = 1;
  // pageSize: number = 6;
  // numberOfPages: number = 0;
  // numberOfRecords: number = 0;
  // totalDoctors: number = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: any, private DoctorSearchService: DoctorSearchService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

 

ngAfterViewInit(): void {

  if(this.isBrowser){
    console.log(this.GovernoratesList);

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
          values: [0, 100, 200, 400, 600, 800, 1000],
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

    // doctorName: '',
    // speciality: Specialities.All,
    // governorate: Governorate.All,
    // gender: Gender.All,
    // waitingTime: 60, // Default waiting time in minutes
    // minPrice: 0,
    // maxPrice: 1000,

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
    this.loadDoctors();
  }

    loadDoctors(): void {
    this.DoctorSearchService.isLoading.set(true);
    this.DoctorSearchService.doctors.set([]);
    this.DoctorSearchService.getFilteredDoctorsWithPagination(this.DoctorSearchService.currentPage()
    , this.DoctorSearchService.pageSize()
    , this.DoctorSearchService.doctorName()
    , this.DoctorSearchService.speciality()
    , this.DoctorSearchService.governorate()
    , this.DoctorSearchService.gender()
    , this.DoctorSearchService.waitingTime()
    , this.DoctorSearchService.minPrice()
    , this.DoctorSearchService.maxPrice()).subscribe({
      next: (response) => {
        this.DoctorSearchService.doctors.set(response.results);
        console.log('Doctors loaded:', this.DoctorSearchService.doctors());
        this.DoctorSearchService.numberOfPages.set(response.total_pages);
        console.log('Total pages:', this.DoctorSearchService.numberOfPages());
        this.DoctorSearchService.numberOfRecords.set(this.DoctorSearchService.numberOfPages() * this.DoctorSearchService.pageSize());
        this.DoctorSearchService.totalDoctors.set(response.total_results);
        this.DoctorSearchService.pageIndex.set(response.page); // Update the current page index  555555555555555555555555555555555555
        // this.pageSize = response.pageSize || this.pageSize; // Ensure pageSize is set correctly
        // this.maxPages = Math.ceil(this.totalDoctors / this.pageSize);

        // After loading doctors, fetch their details to get durations
        // this.loadDoctorDetails();

        this.DoctorSearchService.isLoading.set(false);
        console.log("Tracing: Doctors loaded:", this.DoctorSearchService.doctors());
        console.log("Tracing: Total pages:", this.DoctorSearchService.numberOfPages());
        console.log("Tracing: Number of records:", this.DoctorSearchService.numberOfRecords());
        console.log("Tracing: Total doctors:", this.DoctorSearchService.totalDoctors());
        console.log("Tracing: Current page index:", this.DoctorSearchService.pageIndex());

      },
      error: (error) => {
        console.error('Error fetching movies:', error);
        this.DoctorSearchService.isLoading.set(false);
      }
    });
  }
  onReset(): void {
    this.filters = {
      doctorName: '',
      speciality: Specialities.All,
      governorate: Governorate.All,
      gender: Gender.All,
      waitingTime: 0,
      minPrice: 0,
      maxPrice: 1000
    };
  }
}
