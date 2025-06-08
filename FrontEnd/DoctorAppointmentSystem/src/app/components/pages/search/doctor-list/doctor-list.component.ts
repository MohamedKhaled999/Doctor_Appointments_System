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
@Component({
  selector: 'app-doctor-list',
  imports: [DoctorCardComponent, CommonModule, NgbPaginationModule, PaginationComponent],
  templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.css'
})

export class DoctorListComponent {
  public isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) private platformId: any) {
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
    }
  }


  // ---------------------Pagination-------------------
  pageSize: number = 6;
  pageIndexParent: number = 1;
  get pagedDoctors() {
    const start = (this.pageIndexParent - 1) * this.pageSize;
    return this.doctors.slice(start, start + this.pageSize);
  }
  //---------------------------------------------------


  doctors: Doctor[] = [
    {
      id: 1,
      name: 'John Doe',
      profilePictureUrl: 'maleDoc.jpg',
      title: 'Cardiologist',
      qualifications: ['MBBS', 'MD', 'FACC'],
      fees: 150,
      specializations: ['Cardiology'],
      rating: 4.5,
      waitingTime: 30,
      governorate: 'California',
      location: 'Los Angeles',
      phone: '123-456-7890',
      reservations: [
        {
          ResID: 101,
          Day: 5, // Monday (assuming 0 is Sunday)
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 102,
          Day: 6,
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 103,
          Day: 7, // Wednesday
          Time: '09:00|10:00 AM',
          IsAvailable: false
        },
                {
          ResID: 104,
          Day: 8, // Monday (assuming 0 is Sunday)
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 105,
          Day: 9,
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 106,
          Day: 10, // Wednesday
          Time: '09:00|10:00 AM',
          IsAvailable: false
        }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      profilePictureUrl: 'femaleDoc.jpg',
      title: 'Dermatologist',
      qualifications: ['MBBS', 'MD', 'FAAD'],
      fees: 200,
      specializations: ['Dermatology'],
      rating: 4.8,
      waitingTime: 25,
      governorate: 'California',
      location: 'San Francisco',
      phone: '987-654-3210',
      reservations: [
        {
          ResID: 201,
          Day: 2, // Tuesday
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 202,
          Day: 4, // Thursday
          Time: '09:00|10:00 PM',
          IsAvailable: true
        },
        {
          ResID: 203,
          Day: 5, // Friday
          Time: '01:00|02:00 PM',
          IsAvailable: false
        }
      ]
    },
    {
      id: 3,
      name: 'Jane Smithe',
      profilePictureUrl: 'femaleDoc.jpg',
      title: 'Dermatologist',
      qualifications: ['MBBS', 'MD', 'FAAD'],
      fees: 200,
      specializations: ['Dermatology'],
      rating: 4.8,
      waitingTime: 25,
      governorate: 'California',
      location: 'San Francisco',
      phone: '987-654-3210',
      reservations: [
        {
          ResID: 201,
          Day: 2, // Tuesday
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 202,
          Day: 4, // Thursday
          Time: '09:00|10:00 PM',
          IsAvailable: true
        },
        {
          ResID: 203,
          Day: 5, // Friday
          Time: '01:00|02:00 PM',
          IsAvailable: false
        }
      ]
    },
    {
      id: 4,
      name: 'Jane Smitheeee',
      profilePictureUrl: 'femaleDoc.jpg',
      title: 'Dermatologist',
      qualifications: ['MBBS', 'MD', 'FAAD'],
      fees: 200,
      specializations: ['Dermatology'],
      rating: 4.8,
      waitingTime: 25,
      governorate: 'California',
      location: 'San Francisco',
      phone: '987-654-3210',
      reservations: [
        {
          ResID: 201,
          Day: 2, // Tuesday
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 202,
          Day: 4, // Thursday
          Time: '09:00|10:00 PM',
          IsAvailable: true
        },
        {
          ResID: 203,
          Day: 5, // Friday
          Time: '01:00|02:00 PM',
          IsAvailable: false
        }
      ]
    },
    {
      id: 5,
      name: 'Jane Smitheeeeeeeee',
      profilePictureUrl: 'femaleDoc.jpg',
      title: 'Dermatologist',
      qualifications: ['MBBS', 'MD', 'FAAD'],
      fees: 200,
      specializations: ['Dermatology'],
      rating: 4.8,
      waitingTime: 25,
      governorate: 'California',
      location: 'San Francisco',
      phone: '987-654-3210',
      reservations: [
        {
          ResID: 201,
          Day: 2, // Tuesday
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 202,
          Day: 4, // Thursday
          Time: '09:00|10:00 PM',
          IsAvailable: true
        },
        {
          ResID: 203,
          Day: 5, // Friday
          Time: '01:00|02:00 PM',
          IsAvailable: false
        }
      ]
    },
    {
      id: 1,
      name: 'John Doe',
      profilePictureUrl: 'maleDoc.jpg',
      title: 'Cardiologist',
      qualifications: ['MBBS', 'MD', 'FACC'],
      fees: 150,
      specializations: ['Cardiology'],
      rating: 4.5,
      waitingTime: 30,
      governorate: 'California',
      location: 'Los Angeles',
      phone: '123-456-7890',
      reservations: [
        {
          ResID: 101,
          Day: 5, // Monday (assuming 0 is Sunday)
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 102,
          Day: 6,
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 103,
          Day: 7, // Wednesday
          Time: '09:00|10:00 AM',
          IsAvailable: false
        },
                {
          ResID: 104,
          Day: 8, // Monday (assuming 0 is Sunday)
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 105,
          Day: 9,
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 106,
          Day: 10, // Wednesday
          Time: '09:00|10:00 AM',
          IsAvailable: false
        }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      profilePictureUrl: 'femaleDoc.jpg',
      title: 'Dermatologist',
      qualifications: ['MBBS', 'MD', 'FAAD'],
      fees: 200,
      specializations: ['Dermatology'],
      rating: 4.8,
      waitingTime: 25,
      governorate: 'California',
      location: 'San Francisco',
      phone: '987-654-3210',
      reservations: [
        {
          ResID: 201,
          Day: 2, // Tuesday
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 202,
          Day: 4, // Thursday
          Time: '09:00|10:00 PM',
          IsAvailable: true
        },
        {
          ResID: 203,
          Day: 5, // Friday
          Time: '01:00|02:00 PM',
          IsAvailable: false
        }
      ]
    },
    {
      id: 3,
      name: 'Jane Smithe',
      profilePictureUrl: 'femaleDoc.jpg',
      title: 'Dermatologist',
      qualifications: ['MBBS', 'MD', 'FAAD'],
      fees: 200,
      specializations: ['Dermatology'],
      rating: 4.8,
      waitingTime: 25,
      governorate: 'California',
      location: 'San Francisco',
      phone: '987-654-3210',
      reservations: [
        {
          ResID: 201,
          Day: 2, // Tuesday
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 202,
          Day: 4, // Thursday
          Time: '09:00|10:00 PM',
          IsAvailable: true
        },
        {
          ResID: 203,
          Day: 5, // Friday
          Time: '01:00|02:00 PM',
          IsAvailable: false
        }
      ]
    },
    {
      id: 4,
      name: 'Jane Smitheeee',
      profilePictureUrl: 'femaleDoc.jpg',
      title: 'Dermatologist',
      qualifications: ['MBBS', 'MD', 'FAAD'],
      fees: 200,
      specializations: ['Dermatology'],
      rating: 4.8,
      waitingTime: 25,
      governorate: 'California',
      location: 'San Francisco',
      phone: '987-654-3210',
      reservations: [
        {
          ResID: 201,
          Day: 2, // Tuesday
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 202,
          Day: 4, // Thursday
          Time: '09:00|10:00 PM',
          IsAvailable: true
        },
        {
          ResID: 203,
          Day: 5, // Friday
          Time: '01:00|02:00 PM',
          IsAvailable: false
        }
      ]
    },
    {
      id: 5,
      name: 'Jane Smitheeeeeeeee',
      profilePictureUrl: 'femaleDoc.jpg',
      title: 'Dermatologist',
      qualifications: ['MBBS', 'MD', 'FAAD'],
      fees: 200,
      specializations: ['Dermatology'],
      rating: 4.8,
      waitingTime: 25,
      governorate: 'California',
      location: 'San Francisco',
      phone: '987-654-3210',
      reservations: [
        {
          ResID: 201,
          Day: 2, // Tuesday
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 202,
          Day: 4, // Thursday
          Time: '09:00|10:00 PM',
          IsAvailable: true
        },
        {
          ResID: 203,
          Day: 5, // Friday
          Time: '01:00|02:00 PM',
          IsAvailable: false
        }
      ]
    }
  ];
}