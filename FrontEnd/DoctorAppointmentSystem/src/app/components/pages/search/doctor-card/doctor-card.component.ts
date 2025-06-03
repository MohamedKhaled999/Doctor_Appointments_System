import { Component, Input, OnInit,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Doctor } from '../doctor-list/doctor';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReservationCardComponent } from '../reservation-card/reservation-card.component';

@Component({
  selector: 'app-doctor-card',
  imports: [
    CommonModule,
    RouterModule,
    ReservationCardComponent,
    NgClass
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
  constructor() {

  }
  ngOnInit() {
    
    // You can perform any initialization logic here if needed
    // console.log('Doctor Card Component Initialized');
  }
}
