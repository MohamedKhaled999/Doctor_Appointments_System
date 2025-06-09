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
  isAuthenticated : boolean = false;
  constructor(private userData :DataManagementService){}
  ngOnInit() {
    if (this.appointment.IsAvailable) {
      // This line extracts the time part (HH:mm) from the ISO string "2025-06-10T18:00:00"
      // For example, "2025-06-10T18:00:00" => "18:00"
      this.fromTime = this.appointment.StartTime.split('T')[1].slice(0,5);
      this.fromTime = this.convertToAmPm(this.fromTime);
      this.toTime = this.appointment.EndTime.split('T')[1].slice(0,5)//times[1] || '';
      this.toTime = this.convertToAmPm(this.toTime);

    }
    
    this.Role = this.userData.UserRole();
    console.log(`Role : ${this.Role}`);
  }

  convertToAmPm(time24: string): string {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
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
