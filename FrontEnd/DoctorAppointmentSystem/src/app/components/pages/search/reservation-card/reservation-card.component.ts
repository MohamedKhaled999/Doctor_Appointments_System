import { reservation } from './../../../../core/interfaces/reservation';
import { Component , Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataManagementService } from '../../../../core/services/data-management.service';
import { RouterLink } from '@angular/router';
import { DoctorReservationService } from '../../../../core/services/doctor-reservations.service';

@Component({
  selector: 'app-reservation-card',
  imports: [
    CommonModule,
    RouterLink
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

  constructor(public userData :DataManagementService, private DoctorReservationService : DoctorReservationService){}
  ngOnInit() {
    console.log(this.appointment)
    if (this.appointment.IsAvailable) {
      this.fromTime = this.appointment.StartTime.split('T')[1].slice(0,5);
      this.fromTime = this.convertToAmPm(this.fromTime);
      this.toTime = this.appointment.EndTime.split('T')[1].slice(0,5)//times[1] || '';
      this.toTime = this.convertToAmPm(this.toTime);
      console.log("ngOnInit","reservation-card.component.ts");
      console.log(Date.now());
    }
    
    // // this.Role = this.userData.UserRole();
    // console.log(`Role : ${this.Role}`);
  }



  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    console.log("reservation-card.component.ts", Date.now());
    console.log("ngAfterViewInit called",this.userData.UserRole());
    
      
    
  }
  book(ResId: number) : void{

    console.log("Book button clicked for reservation ID:", ResId);
    this.DoctorReservationService.isLoading.set(true);
    this.DoctorReservationService.bookAnAppointment(ResId,localStorage.getItem('userToken')??'').subscribe({
      next: (response) => {
        this.DoctorReservationService.isLoading.set(false);
        window.open(response.paymentUrl, '_blank');
      },
      error: (error) => {
        console.error('Error booking an appointment:', error);
        this.DoctorReservationService.isLoading.set(false);
      }
      
    });

    
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
