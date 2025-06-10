import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { PatientService } from '../../../core/services/patient.service';
import { GovernoratesService } from '../../../core/services/governorates.service';
import { Patient } from '../../../core/interfaces/patient.interface';
import { Appointment } from '../../../core/interfaces/appoinments.interface';
import { PatientAppointmentComponent } from "../../shared/patient-appointment/patient-appointment.component";
import { NotificationsComponent } from "../../shared/notifications/notifications.component";

@Component({
  selector: 'app-patient-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PatientAppointmentComponent, RouterModule],
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PatientProfileComponent implements OnInit {
  governorates: string[];
  errorMessage: string = '';
  patientForm: FormGroup;
  patient: Patient | undefined;
  activeTab: string = 'details';
  orderSucceeded: boolean | null = null;
  isAccordionOpen: boolean = false;
  /**
   *
   */
  constructor(private governoratesService: GovernoratesService, private fb: FormBuilder, private router: ActivatedRoute, private patientService: PatientService) {
    this.patientForm = this.fb.group({
      firstName: [{ value: '', disables: true }],
      lastName: [{ value: '', disables: true }],
      email: [{ value: '', disables: true }],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?\d{11}$/)]],
      governorate: ['', [Validators.required]],
      birthDate: [{ value: '', disables: true }]
    });
    this.governorates = this.governoratesService.getGovernorates();
  }
  refreshAppointments() {
    this.patientService.getAppoinments(1, 500).subscribe((appointments: Appointment[]) => {
      if (!this.patient) return;
      this.patient.appointments = appointments;
    });
  }
  ngOnInit(): void {
    this.patientService.getProfile().subscribe((response: Patient) => {
      this.patient = response;
      // this.patientService.getAppoinments(1, 500).subscribe((appointments: Appointment[]) => {
      //   if (!this.patient) return;
      //   this.patient.appointments = appointments;
      // });
      this.patientForm.patchValue({
        firstName: this.patient.firstName,
        lastName: this.patient.lastName,
        email: this.patient.email,
        phoneNumber: this.patient.phoneNumber,
        governorate: this.governorates[parseInt(this.patient.governorate) - 1],
        birthDate: this.patient.birthDate
      });
    }
    );
    // this.patient = {
    //   id: 1,
    //   firstName: 'Ahmed',
    //   lastName: 'Ali',
    //   email: 'q9E0J@example.com',
    //   phoneNumber: '01234567890',
    //   governorate: 'Cairo',
    //   birthDate: new Date(),
    //   appointments: [
    //     {
    //       id: 1,
    //       startTime: new Date('2025-06-01T10:00:00'),
    //       endTime: new Date('2025-06-01T11:00:00'),
    //       doctor: 'Dr. Mohamed',
    //       specialty: 'Cardiology',
    //       governorate: 'Cairo',
    //       location: 'Cairo',
    //       doctorImagePath: 'maleDoc.jpg',
    //       isExist: true
    //     }
    //   ]
    // }
    // this.patientForm.patchValue({
    //   firstName: this.patient.firstName,
    //   lastName: this.patient.lastName,
    //   email: this.patient.email,
    //   phoneNumber: this.patient.phoneNumber,
    //   governorate: this.governorates[parseInt(this.patient.governorate) - 1],
    //   birthDate: this.patient.birthDate
    // });
    if (this.router.snapshot.queryParamMap.get('orderSucceeded') === 'true') {
      this.orderSucceeded = true;
      Swal.fire({
        title: "Success",
        text: "Your appointment has been booked!",
        color: "#004085",
        confirmButtonColor: "#004085",
        icon: "success"
      });
    } else if (this.router.snapshot.queryParamMap.get('orderSucceeded') === 'false') {
      this.orderSucceeded = false;
      Swal.fire({
        title: "Error",
        text: "An error has occurred while booking your appointment, please try again!",
        color: "#004085",
        confirmButtonColor: "#004085",
        icon: "error"
      });
    }
  }
  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }
  switchTab(tab: 'details' | 'appointments') {
    this.activeTab = tab;
  }
  onSubmit() {
    if (this.patientForm.invalid) return;
    const patient = {
      id: this.patient?.id || 0,
      firstName: this.patientForm.value.firstName,
      lastName: this.patientForm.value.lastName,
      email: this.patientForm.value.email,
      phoneNumber: this.patientForm.value.phoneNumber,
      governorate: this.governorates.indexOf(this.patientForm.value.governorate) + 1,
      birthDate: this.patientForm.value.birthDate
    };
    this.patientService.updateProfile(patient).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Your profile has been updated!',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      }
    });
  }
}
