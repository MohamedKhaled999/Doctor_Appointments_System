import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestSwiperComponent } from "./components/shared/test-swiper/test-swiper.component";
import { DataManagementService } from './core/services/data-management.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TestSwiperComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DoctorAppointmentSystem';

  constructor( private userData:DataManagementService) {
  }
  ngOnInit(): void {
   
  //  this.userData.UserRole.set(localStorage.getItem("userRole")!);
    
  }

}
