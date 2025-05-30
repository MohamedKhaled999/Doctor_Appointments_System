import { Component } from '@angular/core';
import { DoctorCardComponent } from "../doctor-card/doctor-card.component";
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Doctor } from './doctor';
@Component({
  selector: 'app-doctor-list',
  imports: [DoctorCardComponent, CommonModule],
  templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.css'
})
export class DoctorListComponent {
  doctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. John Doe',
      profilePictureUrl: 'https://example.com/profile.jpg',
      title: 'Cardiologist',
      qualifications: ['MBBS', 'MD', 'FACC'],
      fees: 150,
      specializations: ['Cardiology'],
      rating: 4.5,
      waitingTime: 30,
      governorate: 'California',
      location: 'Los Angeles',
      phone: '123-456-7890'
    },
    {
      id: 2,
      name: 'Dr. Jane Smith',
      profilePictureUrl: 'https://example.com/profile2.jpg',
      title: 'Dermatologist',
      qualifications: ['MBBS', 'MD', 'FAAD'],
      fees: 200,
      specializations: ['Dermatology'],
      rating: 4.8,
      waitingTime: 25,
      governorate: 'California',
      location: 'San Francisco',
      phone: '987-654-3210'
    }
  ];
}
