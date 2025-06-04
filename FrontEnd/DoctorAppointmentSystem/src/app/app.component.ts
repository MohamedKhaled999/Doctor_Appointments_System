import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestSwiperComponent } from "./components/shared/test-swiper/test-swiper.component";
import { AdminDashboardComponent } from './components/pages/Dashboard/admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TestSwiperComponent ,AdminDashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DoctorAppointmentSystem';
}
