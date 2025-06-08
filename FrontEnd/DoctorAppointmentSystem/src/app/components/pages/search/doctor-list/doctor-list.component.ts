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
  constructor(@Inject(PLATFORM_ID) private platformId: any, private DoctorSearchService: DoctorSearchService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  ngOnInit() {
    if(this.isBrowser) {
      // Load AOS only in the browser
      Aos.init({
        duration: 1000,
        easing: 'ease-out-back',
        offset: 75,
        once: false
      });
      this.loadDoctors();
    }
  }


  pageSize: number = 6;
  pageIndexParent = signal(1);

  pageIndexParentEffect = effect(() => {
    const pageIndex = this.pageIndexParent();
    if (typeof pageIndex === 'number' && pageIndex !== this.currentPage) {
      this.currentPage = pageIndex;
      this.loadDoctors();
      // console.log('Page index changed:', pageIndex);
      // console.log('Current page:', this.currentPage);
    }
  });

  currentPage: number = 1;
  totalDoctors: number = 0;
  numberOfPages: number = 0;
  numberOfRecords: number = 0;
  maxPages: number = 0;
  loading: boolean = false;
  doctors: Doctor[] = [];

  loadDoctors(): void {
    this.loading = true;
    this.doctors = [];
    this.DoctorSearchService.getAllDoctorsWithPagination(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.doctors = response.results;
        console.log('Doctors loaded:', this.doctors);
        this.numberOfPages = response.total_pages;
        console.log('Total pages:', this.numberOfPages);
        this.numberOfRecords = this.numberOfPages * this.pageSize;
        this.totalDoctors = response.total_results;
        this.pageIndexParent.set(response.page); // Update the current page index
        // this.pageSize = response.pageSize || this.pageSize; // Ensure pageSize is set correctly
        // this.maxPages = Math.ceil(this.totalDoctors / this.pageSize);

        // After loading doctors, fetch their details to get durations
        // this.loadDoctorDetails();

        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching movies:', error);
        this.loading = false;
      }
      
    });
  }

  // doctors: Doctor[] = [
  //   {
  //     id: 1,
  //     name: 'John Doe',
  //     profilePictureUrl: 'maleDoc.jpg',
  //     title: 'Cardiologist',
  //     qualifications: ['MBBS', 'MD', 'FACC'],
  //     fees: 150,
  //     specializations: ['Cardiology'],
  //     rating: 4.5,
  //     waitingTime: 30,
  //     governorate: 'California',
  //     location: 'Los Angeles',
  //     phone: '123-456-7890',
  //     reservations: [
  //       {
  //         ResID: 101,
  //         Day: 5, // Monday (assuming 0 is Sunday)
  //         Time: '09:00|10:00 AM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 102,
  //         Day: 6,
  //         Time: '09:00|10:00 AM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 103,
  //         Day: 7, // Wednesday
  //         Time: '09:00|10:00 AM',
  //         IsAvailable: false
  //       },
  //               {
  //         ResID: 104,
  //         Day: 8, // Monday (assuming 0 is Sunday)
  //         Time: '09:00|10:00 AM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 105,
  //         Day: 9,
  //         Time: '09:00|10:00 AM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 106,
  //         Day: 10, // Wednesday
  //         Time: '09:00|10:00 AM',
  //         IsAvailable: false
  //       }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     name: 'Jane Smith',
  //     profilePictureUrl: 'femaleDoc.jpg',
  //     title: 'Dermatologist',
  //     qualifications: ['MBBS', 'MD', 'FAAD'],
  //     fees: 200,
  //     specializations: ['Dermatology'],
  //     rating: 4.8,
  //     waitingTime: 25,
  //     governorate: 'California',
  //     location: 'San Francisco',
  //     phone: '987-654-3210',
  //     reservations: [
  //       {
  //         ResID: 201,
  //         Day: 2, // Tuesday
  //         Time: '09:00|10:00 AM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 202,
  //         Day: 4, // Thursday
  //         Time: '09:00|10:00 PM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 203,
  //         Day: 5, // Friday
  //         Time: '01:00|02:00 PM',
  //         IsAvailable: false
  //       }
  //     ]
  //   },
  //   {
  //     id: 3,
  //     name: 'Jane Smithe',
  //     profilePictureUrl: 'femaleDoc.jpg',
  //     title: 'Dermatologist',
  //     qualifications: ['MBBS', 'MD', 'FAAD'],
  //     fees: 200,
  //     specializations: ['Dermatology'],
  //     rating: 4.8,
  //     waitingTime: 25,
  //     governorate: 'California',
  //     location: 'San Francisco',
  //     phone: '987-654-3210',
  //     reservations: [
  //       {
  //         ResID: 201,
  //         Day: 2, // Tuesday
  //         Time: '09:00|10:00 AM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 202,
  //         Day: 4, // Thursday
  //         Time: '09:00|10:00 PM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 203,
  //         Day: 5, // Friday
  //         Time: '01:00|02:00 PM',
  //         IsAvailable: false
  //       }
  //     ]
  //   },
  //   {
  //     id: 4,
  //     name: 'Jane Smitheeee',
  //     profilePictureUrl: 'femaleDoc.jpg',
  //     title: 'Dermatologist',
  //     qualifications: ['MBBS', 'MD', 'FAAD'],
  //     fees: 200,
  //     specializations: ['Dermatology'],
  //     rating: 4.8,
  //     waitingTime: 25,
  //     governorate: 'California',
  //     location: 'San Francisco',
  //     phone: '987-654-3210',
  //     reservations: [
  //       {
  //         ResID: 201,
  //         Day: 2, // Tuesday
  //         Time: '09:00|10:00 AM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 202,
  //         Day: 4, // Thursday
  //         Time: '09:00|10:00 PM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 203,
  //         Day: 5, // Friday
  //         Time: '01:00|02:00 PM',
  //         IsAvailable: false
  //       }
  //     ]
  //   },
  //   {
  //     id: 5,
  //     name: 'Jane Smitheeeeeeeee',
  //     profilePictureUrl: 'femaleDoc.jpg',
  //     title: 'Dermatologist',
  //     qualifications: ['MBBS', 'MD', 'FAAD'],
  //     fees: 200,
  //     specializations: ['Dermatology'],
  //     rating: 4.8,
  //     waitingTime: 25,
  //     governorate: 'California',
  //     location: 'San Francisco',
  //     phone: '987-654-3210',
  //     reservations: [
  //       {
  //         ResID: 201,
  //         Day: 2, // Tuesday
  //         Time: '09:00|10:00 AM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 202,
  //         Day: 4, // Thursday
  //         Time: '09:00|10:00 PM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 203,
  //         Day: 5, // Friday
  //         Time: '01:00|02:00 PM',
  //         IsAvailable: false
  //       }
  //     ]
  //   },
  //   {
  //     id: 1,
  //     name: 'John Doe',
  //     profilePictureUrl: 'maleDoc.jpg',
  //     title: 'Cardiologist',
  //     qualifications: ['MBBS', 'MD', 'FACC'],
  //     fees: 150,
  //     specializations: ['Cardiology'],
  //     rating: 4.5,
  //     waitingTime: 30,
  //     governorate: 'California',
  //     location: 'Los Angeles',
  //     phone: '123-456-7890',
  //     reservations: [
  //       {
  //         ResID: 101,
  //         Day: 5, // Monday (assuming 0 is Sunday)
  //         Time: '09:00|10:00 AM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 102,
  //         Day: 6,
  //         Time: '09:00|10:00 AM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 103,
  //         Day: 7, // Wednesday
  //         Time: '09:00|10:00 AM',
  //         IsAvailable: false
  //       },
  //               {
  //         ResID: 104,
  //         Day: 8, // Monday (assuming 0 is Sunday)
  //         Time: '09:00|10:00 AM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 105,
  //         Day: 9,
  //         Time: '09:00|10:00 AM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 106,
  //         Day: 10, // Wednesday
  //         Time: '09:00|10:00 AM',
  //         IsAvailable: false
  //       }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     name: 'Jane Smith',
  //     profilePictureUrl: 'femaleDoc.jpg',
  //     title: 'Dermatologist',
  //     qualifications: ['MBBS', 'MD', 'FAAD'],
  //     fees: 200,
  //     specializations: ['Dermatology'],
  //     rating: 4.8,
  //     waitingTime: 25,
  //     governorate: 'California',
  //     location: 'San Francisco',
  //     phone: '987-654-3210',
  //     reservations: [
  //       {
  //         ResID: 201,
  //         Day: 2, // Tuesday
  //         Time: '09:00|10:00 AM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 202,
  //         Day: 4, // Thursday
  //         Time: '09:00|10:00 PM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 203,
  //         Day: 5, // Friday
  //         Time: '01:00|02:00 PM',
  //         IsAvailable: false
  //       }
  //     ]
  //   },
  //   {
  //     id: 3,
  //     name: 'Jane Smithe',
  //     profilePictureUrl: 'femaleDoc.jpg',
  //     title: 'Dermatologist',
  //     qualifications: ['MBBS', 'MD', 'FAAD'],
  //     fees: 200,
  //     specializations: ['Dermatology'],
  //     rating: 4.8,
  //     waitingTime: 25,
  //     governorate: 'California',
  //     location: 'San Francisco',
  //     phone: '987-654-3210',
  //     reservations: [
  //       {
  //         ResID: 201,
  //         Day: 2, // Tuesday
  //         Time: '09:00|10:00 AM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 202,
  //         Day: 4, // Thursday
  //         Time: '09:00|10:00 PM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 203,
  //         Day: 5, // Friday
  //         Time: '01:00|02:00 PM',
  //         IsAvailable: false
  //       }
  //     ]
  //   },
  //   {
  //     id: 4,
  //     name: 'Jane Smitheeee',
  //     profilePictureUrl: 'femaleDoc.jpg',
  //     title: 'Dermatologist',
  //     qualifications: ['MBBS', 'MD', 'FAAD'],
  //     fees: 200,
  //     specializations: ['Dermatology'],
  //     rating: 4.8,
  //     waitingTime: 25,
  //     governorate: 'California',
  //     location: 'San Francisco',
  //     phone: '987-654-3210',
  //     reservations: [
  //       {
  //         ResID: 201,
  //         Day: 2, // Tuesday
  //         Time: '09:00|10:00 AM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 202,
  //         Day: 4, // Thursday
  //         Time: '09:00|10:00 PM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 203,
  //         Day: 5, // Friday
  //         Time: '01:00|02:00 PM',
  //         IsAvailable: false
  //       }
  //     ]
  //   },
  //   {
  //     id: 5,
  //     name: 'Jane Smitheeeeeeeee',
  //     profilePictureUrl: 'femaleDoc.jpg',
  //     title: 'Dermatologist',
  //     qualifications: ['MBBS', 'MD', 'FAAD'],
  //     fees: 200,
  //     specializations: ['Dermatology'],
  //     rating: 4.8,
  //     waitingTime: 25,
  //     governorate: 'California',
  //     location: 'San Francisco',
  //     phone: '987-654-3210',
  //     reservations: [
  //       {
  //         ResID: 201,
  //         Day: 2, // Tuesday
  //         Time: '09:00|10:00 AM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 202,
  //         Day: 4, // Thursday
  //         Time: '09:00|10:00 PM',
  //         IsAvailable: true
  //       },
  //       {
  //         ResID: 203,
  //         Day: 5, // Friday
  //         Time: '01:00|02:00 PM',
  //         IsAvailable: false
  //       }
  //     ]
  //   }
  // ];
}