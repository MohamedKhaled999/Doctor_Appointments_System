import { Component, Input, OnInit,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DoctorReservationService } from '../../../../core/services/doctor-reservations.service';
import { DataManagementService } from '../../../../core/services/data-management.service';
import { ReservationCardsContainerComponent } from "../../../shared/reservation-cards-container/reservation-cards-container.component";
@Component({
  selector: 'app-doctor-card',
  imports: [
    CommonModule,
    RouterModule,
    ReservationCardsContainerComponent
],
  templateUrl: './doctor-card.component.html',
  styleUrl: './doctor-card.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class DoctorCardComponent implements OnInit {

  @Input() doctor: any;
  authService : any;
  showModal: any;
  getNextDate:any;
  constructor(protected DoctorReservationService: DoctorReservationService,
     public userData :DataManagementService) {

  }
  ngOnInit() {
    
    // You can perform any initialization logic here if needed
    // console.log('Doctor Card Component Initialized');
    this.loadReservations();
  }
  loadReservations(): void {
    this.DoctorReservationService.isLoading.set(true);
    
    this.DoctorReservationService.getReservations(this.doctor.id).subscribe({
      next: (response) => {
        this.doctor.reservations = response.reservations;
        // console.log('reservation before getting upcoming reservations:', JSON.stringify(this.doctor.reservations, null, 2));
        this.doctor.reservations = this.DoctorReservationService.getUpcomingReservations(this.doctor.reservations)
        // console.log('reservation after getting upcoming reservations:', JSON.stringify(this.doctor.reservations, null, 2));

        // console.log(`reservation response: ${this.doctor.reservations}`)
        // console.log('reservation response:', JSON.stringify(response, null, 2));
        this.DoctorReservationService.isLoading.set(false);
      },
      error: (error) => {
        // console.error('Error fetching reservations:', error);
        this.doctor.reservations =[];
        this.DoctorReservationService.isLoading.set(false);
      }
      
    });
  }
}
