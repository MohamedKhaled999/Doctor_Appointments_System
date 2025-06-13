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
  isPast = false;
  /**
   *
  */
 constructor(private doctorService: DoctorService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.reservationId = data.id;
    this.isPast = new Date(data.date) < new Date();
  }
  ngOnInit(): void {
    this.doctorService.getAppoinments(this.reservationId).subscribe({
      next: (appointments: ReservationAppointment[]) => {
        this.appointments = appointments;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error fetching appointments:', error);
        this.loading = false;
      }
    });
    // this.appointments= [
      //   {id:1, patient: 'John', documentUrls: 'testadadadadqwada.pdf||test2dwaddadawdadawdawdawdadadada.pdf||test3dawdadadawdawdawawawdawdawdawdad.pdf', prescriptionUrl: '',
      //   },
    //   {id:2, patient: 'John', documentUrls: 'test.pdf||test2.pdf||test3.pdf', prescriptionUrl: '',
    //   }
    //   ,
    //   {id:3, patient: 'John', documentUrls: 'test.pdf||test2.pdf||test3.pdf', prescriptionUrl: '',
    //   }
    // ]
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
            this.doctorService.getAppoinments(this.reservationId).subscribe({
              next: (appointments: ReservationAppointment[]) => {
                this.appointments = appointments;
              },
              error: (error: any) => {
                console.error('Error fetching updated appointments:', error);
              }
            });
          },
          error: (error: any) => {
            console.error('Error uploading prescription:', error);
            this.fileErrors = [`Error uploading prescription: ${error.error.Errors[0]}`];
          }
        })
      } else {
        this.fileErrors = [`Invalid file type or size for ${file.name}.`];
      }
    }
  }
  onDeletePrescription(appointmentId: number) {
    this.doctorService.deletePrescription(this.reservationId, appointmentId).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Prescription deleted successfully',
          color: '#004085',
          confirmButtonColor: '#004085'
        });
        this.appointments = this.appointments?.map(appointment => {
          if (appointment.id === appointmentId) {
            return { ...appointment, prescriptionUrl: null };
          }
          return appointment;
        });
      },
      error: (error: any) => {
        console.error('Error deleting prescription:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error deleting prescription',
          text: error.error.message || 'An error occurred while deleting the prescription.',
          color: '#004085',
          confirmButtonColor: '#004085'
        });
      }
    });
  }
}
