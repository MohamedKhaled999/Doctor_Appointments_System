import { Component , Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { reservation } from '../../../../core/interfaces/reservation';

@Component({
  selector: 'app-reservation-card',
  imports: [
    CommonModule,
  ],
  templateUrl: './reservation-card.component.html',
  styleUrl: './reservation-card.component.css'
})
export class ReservationCardComponent {
  @Input() app : any;
  authService : any;
  showModal: any;
  fromTime: string = '';
  toTime: string = '';

ngOnInit() {
  if (this.app && this.app.Time) {
    const times = this.app.Time.split('|');
    this.fromTime = times[0] || '';
    this.toTime = times[1] || '';
  }
}
  getNextDate(day: number): string {

    const today = new Date();
    const todayIndex = today.getDate();
    const daysToAdd = day - todayIndex;

    if (daysToAdd === 0) return "Today";
    if (daysToAdd === 1) return "Tomorrow";

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);

    // Format: "Tue 1/12"
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'numeric' };
    return nextDate.toLocaleDateString('en-US', options).replace(',', '');
  }

}
