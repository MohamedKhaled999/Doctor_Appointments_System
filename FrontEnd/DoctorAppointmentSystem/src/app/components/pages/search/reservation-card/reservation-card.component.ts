import { Component , Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { reservation } from '../../../../core/interfaces/reservation';
import { DataManagementService } from '../../../../core/services/data-management.service';

@Component({
  selector: 'app-reservation-card',
  imports: [
    CommonModule,
  ],
  templateUrl: './reservation-card.component.html',
  styleUrl: './reservation-card.component.css'
})
export class ReservationCardComponent {
  @Input() appointment : any;
  authService : any;
  showModal: any;
  fromTime: string = '';
  toTime: string = '';
  Role: any;
  constructor(private userData :DataManagementService){}
  ngOnInit() {
    if (this.appointment && this.appointment.Time) {
      const times = this.appointment.Time.split('|');
      this.fromTime = times[0] || '';
      this.toTime = times[1] || '';
    }
    
    this.Role =   this.userData.UserRole.set(localStorage.getItem("userRole")!);
    console.log(`Role : ${this.Role} thanks`);
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
