import { Component ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { ReservationCardComponent } from "../../pages/search/reservation-card/reservation-card.component";

@Component({
  selector: 'app-test-swiper',
  imports: [ReservationCardComponent],
  templateUrl: './test-swiper.component.html',
  styleUrl: './test-swiper.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TestSwiperComponent {

  // Sample data for the swiper
  reservations = [
    
        {
          ResID: 101,
          Day: 2, // Monday (assuming 0 is Sunday)
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 102,
          Day: 3,
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 103,
          Day: 4, // Wednesday
          Time: '09:00|10:00 AM',
          IsAvailable: false
        },
          {
          ResID: 101,
          Day: 2, // Monday (assuming 0 is Sunday)
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 102,
          Day: 3,
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 103,
          Day: 4, // Wednesday
          Time: '09:00|10:00 AM',
          IsAvailable: false
        }
      
  ];

}
