import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { DataManagementService } from './core/services/data-management.service';
import { isPlatformBrowser } from '@angular/common';
import AOS from 'aos';


import { NgxSpinnerComponent } from 'ngx-spinner';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DoctorAppointmentSystem';
  isBrowser: boolean;

  constructor(private dataService: DataManagementService, @Inject(PLATFORM_ID) private platformId: any, private router: Router) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.router.events.subscribe((event) => {
        if (!(event instanceof NavigationEnd)) {
          return;
        }
        if (document.body.style.overflow === 'hidden') {
          document.body.style.overflow = 'auto';
          document.body.style.paddingRight = '0';
        }
        window.scrollTo(0, 0)
      });

      AOS.init({
        duration: 1000, // Animation duration in milliseconds
        once: true, // Whether animation should happen only once while scrolling down
        mirror: false, // Whether elements should animate out while scrolling past them
        disable: 'mobile', // Disable animations on mobile devices
      });
      AOS.refresh();

      this.dataService.UserName.set(localStorage.getItem('userName') || '');
      this.dataService.UserRole.set(localStorage.getItem('userRole') || '');
      this.dataService.isAuthenticated.set(localStorage.getItem('userToken') !== null);
      console.log("App Component ngOnInit");

    }
  }
}
