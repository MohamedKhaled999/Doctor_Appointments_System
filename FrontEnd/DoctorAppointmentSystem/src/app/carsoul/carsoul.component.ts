// doctors-carousel.component.ts
import { Component, AfterViewInit, Input } from '@angular/core';

import Swiper from 'swiper';
import mixitup from 'mixitup';
import { Doctor } from '../core/interfaces/doctor';
import { Specialty } from '../core/interfaces/specialty.interface';
import { RatingComponent } from '../components/shared/rating/rating.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-doctors-carousel',
  standalone: true,
  imports: [CommonModule, RatingComponent],
  templateUrl: './carsoul.component.html',
  styleUrls: ['./carsoul.component.css']
})

export class DoctorsCarouselComponent implements AfterViewInit {
  
  @Input()  doctors: Doctor[] = [];
  @Input() specialties: Specialty[] = [];

  private swiper: Swiper | undefined;
  private swiperButtons: Swiper | undefined;
  private mixer: any;

  ngAfterViewInit() {
    this.initSwiper();
    this.initFilterButtons();
    this.initMixItUp();
  }

  private initSwiper() {
    this.swiper = new Swiper('.swiper-container', {
      navigation: {
        nextEl: '.doctor-button-next',
        prevEl: '.doctor-button-prev',
      },
      watchOverflow: true,
      autoplay: false,
      spaceBetween: 15,
      breakpoints: {
        320: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 3 },
      },
    });
  }

  private initFilterButtons() {
    this.swiperButtons = new Swiper('.swiper-container-btns', {
      spaceBetween: 5,
      breakpoints: {
        100: { slidesPerView: 2 },
        300: { slidesPerView: 3 },
        500: { slidesPerView: 4 },
        1024: { slidesPerView: 10 },
      },
    });
    this.swiperButtons.slideTo(0);
  }

  private initMixItUp() {
    this.mixer = mixitup('#mixContainer', {
      animation: {
        duration: 300,
      },
      callbacks: {
        onMixEnd: () => {
          if (this.swiper) {
            this.swiper.update();
          }
        }
      }
    });
  }

  filterDoctors(filter: string) {
    if (this.mixer) {
      this.mixer.filter(filter);
    }
  }
}