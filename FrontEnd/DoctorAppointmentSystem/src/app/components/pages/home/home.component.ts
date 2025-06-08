import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import Swiper from 'swiper';
import Typed from 'typed.js';
import * as AOS from 'aos';
import { Doctor } from '../../../core/interfaces/doctor.interface';
import { Specialty } from '../../../core/interfaces/specialty.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RatingComponent } from '../../shared/rating/rating.component';
import { FooterComponent } from '../../../footer/footer.component';
import { NavbarComponent } from "../../navbar/navbar.component";
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
// import mixitup from 'mixitup';
// import mixitup, { Mixer } from 'mixitup';
// import mixitup, { Mixer } from 'mixitup'; // ✅ Correct way



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RatingComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
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

  mixer: any; // ✅ Now valid
  constructor(private apiService: ApiService ,@Inject(PLATFORM_ID) private platformId: Object ,  private cdr: ChangeDetectorRef,) {}

  ngOnInit(): void {
    this.loadHomeData();
    console.log(this.filteredDoctors);
    if (isPlatformBrowser(this.platformId)) {
      AOS.init();
    }
   
  }

   ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initSwipers();
      this.initTyped();

      // ✅ Dynamic import of mixitup to avoid SSR issues
      import('mixitup').then(({ default: mixitup }) => {
        this.mixer = mixitup('#mixContainer', {
          animation: {
            duration: 300
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
  }



  loadHomeData(): void {
    this.apiService.getHomeData().subscribe({
      next: (data) => {
        this.homeData = data;
        this.specialties = data.specialties || [];

      
        setTimeout(() => {
          this.specialtyAosValues = this.specialties.map(() => this.getRandomAosAnimation());
          this.cdr.detectChanges();
        });
        
        this.doctors = data.doctors || [];
        this.filteredDoctors = [...this.doctors];
  
        setTimeout(() => {
          this.doctorAosValues = this.filteredDoctors.map(() => this.getRandomAosAnimation());
          this.cdr.detectChanges(); 
        });
  
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading home data:', err);
        this.loading = false;
      }
    });
  }
  

  // getRandomAosAnimation(): string {
  //   const index = Math.floor(Math.random() * this.aosAnimations.length);
  //   return this.aosAnimations[index];
  // }

  
  getRandomAosAnimation(): string {
    const index = Math.floor(Math.random() * this.aosAnimations.length);
    return this.aosAnimations[index];
  }
  

  initSwipers(): void {
    this.swiper = new Swiper('.swiper', {
      effect: 'fade',
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false
      },
      speed: 1000,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      scrollbar: {
        el: '.swiper-scrollbar'
      }
    });
  this.swiper2 = new Swiper('.swiper-container', {
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
        init: () => {
          console.log('Doctors swiper initialized');
        }
      }
    });
    this.swiper3 = new Swiper('.swiper-container-btns', {
      spaceBetween: 5,
      breakpoints: {
        100: { slidesPerView: 2 },
        300: { slidesPerView: 3 },
        500: { slidesPerView: 4 },
        1024: { slidesPerView: 10 }
      }
    });

    this.swiper3.slideTo(0);
  }

  initTyped(): void {
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


  getSpecialtyIcon(specialtyId: number): string {
    switch (specialtyId) {
      case 1:
        // Return SVG for cardiology
        return ``;
      case 2:
        // Return SVG for neurology
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="30" cy="30" r="25" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path d="M30 5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM30 10c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM30 15c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
                </svg>`;
      default:
        return '';  
    }
    
  }
  ngOnDestroy(): void {
    if (this.typed) this.typed.destroy();
  }
}
