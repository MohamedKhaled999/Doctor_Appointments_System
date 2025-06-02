import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Filter, Specialities, Governorates, Gender } from './filter';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as noUiSlider from 'nouislider';
import wNumb from 'wnumb';
import { NgModule } from '@angular/core';
import { NouisliderModule } from 'ng2-nouislider';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
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
  GovernoratesList = Object.values(Governorates);
  GenderList = Object.values(Gender);
  filters: Filter = {
    doctorName: '',
    speciality: Specialities.All,
    governorate: Governorates.All,
    gender: Gender.All,
    waitingTime: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  };
 sliderConfig:any = {};


 public isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

 

  ngAfterViewInit(): void {


   
  if(this.isBrowser){
    
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

  onFilter(): void {
    console.log('Filters applied:', this.filters);
  }

  onReset(): void {
    this.filters = {
      doctorName: '',
      speciality: Specialities.All,
      governorate: Governorates.All,
      gender: Gender.All,
    };
  }
}
