import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Doctor } from '../doctor-list/doctor';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-doctor-card',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './doctor-card.component.html',
  styleUrl: './doctor-card.component.css',

})
export class DoctorCardComponent implements OnInit {
  @Input() doctor: any;

  constructor() {

  }
  ngOnInit() {
    // You can perform any initialization logic here if needed
    // console.log('Doctor Card Component Initialized');
  }
  
  // doctor: Doctor[] = [{ 
  //   id: 1,
  //   name: 'Dr. John Doe',
  //   profilePictureUrl: 'https://example.com/profile.jpg',
  //   title: 'Cardiologist',
  //   qualifications: ['MBBS', 'MD', 'FACC'],
  //   fees: 150,
  //   specialization: 'Cardiology',
  //   rating: 4.5,
  //   waitingTime: 30,
  //   governorate: 'California',
  //   location: 'Los Angeles',
  //   phone: '123-456-7890'
    
  // }];  
}
