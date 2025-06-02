import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestSwiperComponent } from "./components/shared/test-swiper/test-swiper.component";
import AOS from 'aos'; 
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TestSwiperComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DoctorAppointmentSystem';
  isBrowser: boolean;
  
  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
       AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once while scrolling down
      mirror: false, // Whether elements should animate out while scrolling past them
      disable: 'mobile', // Disable animations on mobile devices
    });
     AOS.refresh();

    }
       // You can perform any initialization logic here
    console.log('AppComponent initialized');
  }
}
