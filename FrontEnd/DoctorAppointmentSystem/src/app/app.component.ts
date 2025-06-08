import { Component, Inject, PLATFORM_ID,OnInit  } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DataManagementService } from './core/services/data-management.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { isPlatformBrowser } from '@angular/common';
import AOS from 'aos'; 

import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet , NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DoctorAppointmentSystem';
  isBrowser: boolean;
  
  constructor(private userData:DataManagementService, @Inject(PLATFORM_ID) private platformId: any) {
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

  //     console.log('AppComponent initialized');

  //  this.userData.UserRole.set(localStorage.getItem("userRole")!);



    }

       // You can perform any initialization logic here
   

  }
}
