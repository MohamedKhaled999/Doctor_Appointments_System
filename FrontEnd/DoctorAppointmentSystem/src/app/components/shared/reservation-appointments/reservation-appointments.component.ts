import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { DoctorService } from '../../../core/services/doctor.service';
import { Appointment } from '../../../core/interfaces/appoinments.interface';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReservationAppointment } from '../../../core/interfaces/reservationAppointment.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservation-appointments',
  imports: [CommonModule],
  templateUrl: './reservation-appointments.component.html',
  styleUrl: './reservation-appointments.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReservationAppointmentsComponent implements OnInit {
  reservationId: number;
  appointments: ReservationAppointment[] | undefined;
  loading = true;
  fileErrors: string[] | undefined;
  acceptedFileTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  maxFileSize: number = 5 * 1024 * 1024;
  /**
   *
   */
  constructor(private doctorService: DoctorService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.reservationId = data;
  }
  ngOnInit(): void {
    this.doctorService.getAppoinments(this.reservationId).subscribe({
      next: (appointments: ReservationAppointment[]) => {
        this.appointments = appointments;
        this.loading = false;
        console.log('Fetched appointments:', this.appointments);
        
      },
      error: (error: any) => {
        console.error('Error fetching appointments:', error);
        this.loading = false;
      }
    });
  }
  onFileSelected(event: any, appointment: ReservationAppointment) {
    this.fileErrors = undefined;
    const files: FileList = event.target.files;
    if (files.length > 0) {
      const file: File = files[0];
      if (this.acceptedFileTypes.includes(file.type) && file.size <= this.maxFileSize) {
        const formData = new FormData();
        formData.append('document', file, file.name);
        this.doctorService.addPrescription(this.reservationId, appointment.id, formData).subscribe({
          next: (response: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Prescription uploaded successfully',
              color: '#004085',
              confirmButtonColor: '#004085'
            });
          },
          error: (error: any) => {
            console.error('Error uploading prescription:', error);
            this.fileErrors = [`Error uploading prescription for ${file.name}. Please try again.`];
          }
        })
      } else {
        this.fileErrors = [`Invalid file type or size for ${file.name}.`];
      }
    }
  }
}
