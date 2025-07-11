import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Doctor } from '../../../core/interfaces/doctor';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReservationCardComponent } from './reservation-card/reservation-card.component';
import { DoctorReservationService } from '../../../core/services/doctor-reservations.service';
import { DataManagementService } from '../../../core/services/data-management.service';
@Component({
  selector: 'app-reservation-cards-container',
  imports: [
    CommonModule,
    RouterModule,
    ReservationCardComponent,
    NgClass
  ],
  templateUrl: './reservation-cards-container.component.html',
  styleUrl: './reservation-cards-container.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class ReservationCardsContainerComponent {
  swiperBreakpoints = {
    0: {
      slidesPerView: 2
    },
    1199: {
      slidesPerView: 3
    }
  };
  @Input() reservations: any;

  constructor(public userData: DataManagementService) { }
}
