import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestSwiperComponent } from "./components/shared/test-swiper/test-swiper.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TestSwiperComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DoctorAppointmentSystem';
}
