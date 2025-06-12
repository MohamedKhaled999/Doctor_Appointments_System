import { Component, OnInit, AfterViewInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import Swiper from 'swiper';
import Typed from 'typed.js';
import * as AOS from 'aos';
import { Doctor } from '../../../core/interfaces/doctor.interface';
import { Specialty } from '../../../core/interfaces/specialty.interface';
import { CommonModule } from '@angular/common';
import 'swiper/css';
import { Navigation } from 'swiper/modules';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RatingComponent } from '../../shared/rating/rating.component';

import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { DoctorSearchService } from '../../../core/services/doctor-search.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RatingComponent,
  ],

  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  homeData: any;
  specialties: Specialty[] = [];
  doctors: Doctor[] = [];

  filteredDoctors: Doctor[] = [];
  activeFilter: string = 'all';
  loading = true;
  aosAnimations: string[] = ['fade-right', 'fade-up', 'fade-left'];
  doctorAosValues: string[] = [];
  specialtyAosValues: string[] = [];

  private swiper!: Swiper;
  private swiper2!: Swiper;
  private swiper3!: Swiper;
  private typed!: Typed;
  mixer: any;

  constructor(
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    public DoctorSearchService: DoctorSearchService
  ) { }

  ngOnInit(): void {
    this.loadHomeData();
    console.log('Specialties:', this.specialties);
    console.log('doctors:', this.doctors);
    console.log('doctors:', this.doctors);
    console.log(this.filteredDoctors);
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({
        disable:false
      });
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.doctors.length > 0 && this.specialties.length > 0) {
        this.initSwipers();
      } else {
        // If data isn't loaded yet, wait for it
        const subscription = this.apiService.getHomeData().subscribe(() => {
          this.initSwipers();
          subscription.unsubscribe();
        });
      }
      this.initMixItUp();
    }
  }

  private initSwipers(): void {
    setTimeout(() => {
      this.initSwiper1();
      this.initSwiper2();
      this.initSwiper3();
      this.initTyped();
    }, 500);
  }


  private initMixItUp(): void {
    import('mixitup').then(({ default: mixitup }) => {
      this.mixer = mixitup('#mixContainer', {
        animation: {
          duration: 5000
        },
        callbacks: {
          onMixEnd: () => {
            console.log('MixItUp filter completed');
          }
        }
      });
    }).catch(err => {
      console.error('Failed to load mixitup:', err);
    });
  }

  loadHomeData(): void {
    this.apiService.getHomeData().subscribe({
      next: (data) => {
        this.homeData = data;

        this.specialties = data.specialties || [];
        this.specialtyAosValues = this.specialties.map(() => this.getRandomAosAnimation());

        this.doctors = data.doctors || [];
        this.filteredDoctors = [...this.doctors];
        this.doctorAosValues = this.filteredDoctors.map(() => this.getRandomAosAnimation());

        this.loading = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.initSwiper1();
          this.initSwiper2();
          this.initSwiper3();
        }, 300);
      },
      error: (err) => {
        console.error('Error loading home data:', err);
        this.loading = false;
      }
    });
  }

  getRandomAosAnimation(): string {
    const index = Math.floor(Math.random() * this.aosAnimations.length);
    return this.aosAnimations[index];
  }

  initTyped(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.typed = new Typed("#words", {
        strings: [
          "Find the best doctors, book appointments instantly!",
          "Quality healthcare, just a click away!",
          "Your health, our priority—trusted care at your fingertips."
        ],
        typeSpeed: 30,
        backSpeed: 25,
        fadeOut: true,
        loop: true
      });
    }
  }

  filterDoctors(filter: string): void {
    this.activeFilter = filter;
    if (filter === 'all') {
      this.filteredDoctors = [...this.doctors];
    } else {
      this.filteredDoctors = this.doctors.filter(d => d.specialty.toString() === filter);
    }

    this.doctorAosValues = this.filteredDoctors.map(() => this.getRandomAosAnimation());

    setTimeout(() => {
      this.swiper2.update();
      AOS.refresh();
    }, 300);
  }

  trackSpecialtyId(index: number, specialty: any): any {
    return specialty.id;
  }

  getDoctorCountBySpecialtyName(specialtyName: string): number {
    return this.doctors.filter(d => d.specialty === specialtyName).length;
  }

  initSwiper1(): void {
    if (isPlatformBrowser(this.platformId)) {
      // this.swiper = new Swiper('.swiper', {
      //   effect: 'fade',
      //   loop: true,
      //   autoplay: {
      //     delay: 3000,
      //     disableOnInteraction: false
      //   },
      //   speed: 1000,
      //   pagination: {
      //     el: '.swiper-pagination',
      //     clickable: true
      //   },
      //   scrollbar: {
      //     el: '.swiper-scrollbar'
      //   }
      // });
    }
  }

  initSwiper2(): void {
    if (isPlatformBrowser(this.platformId)) {

      this.swiper2 = new Swiper('.swiper-container', {
        modules: [Navigation],
        navigation: {
          nextEl: '.doctor-button-next',
          prevEl: '.doctor-button-prev',
        },
        slidesPerView: 1,
        spaceBetween: 15,
        breakpoints: {
          320: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 }
        },
        on: {
          init: (swiper) => {
            console.log('Doctors swiper initialized with navigation:', {
              next: swiper.navigation.nextEl,
              prev: swiper.navigation.prevEl
            });
          }
        }
      });

      this.swiper2.slideTo(0);
    }
  }

  initSwiper3(): void {
    if (isPlatformBrowser(this.platformId)) {

      this.swiper3 = new Swiper(".swiper-container-btns", {
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        spaceBetween: 5,
        breakpoints: {
          100: { slidesPerView: 2 },
          300: { slidesPerView: 3 },
          500: { slidesPerView: 4 },
          1024: { slidesPerView: 10 },
        },
      });

      this.swiper3.slideTo(0);
    }
  }

  ngOnDestroy(): void {
    if (this.typed) this.typed.destroy();
  }
}