import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../../core/interfaces/appoinments.interface';
import { Review } from '../../../core/interfaces/review.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient-appointment',
  imports: [CommonModule],
  templateUrl: './patient-appointment.component.html',
  styleUrl: './patient-appointment.component.css'
})
export class PatientAppointmentComponent {
  @Input() appointment: Appointment | undefined;
  @Output() cancelAppointment = new EventEmitter<number>();
  @Output() addReview = new EventEmitter<Appointment>();
  get isPast() {
    console.log('Checking if appointment is past:', this.appointment);

    return this.appointment ? new Date(this.appointment.endTime) < new Date() : false;
  }
  onCancel() {
    Swal.fire({
      icon: "error",
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
      color: "#004085",
      confirmButtonColor: "#004085",
    }).then((result) => {
      console.log(result)
      if (result.isConfirmed) {
        if (this.appointment) {
          this.cancelAppointment.emit(this.appointment.id);
        }
      }
    });
  }
  onAddReview(appointment: Appointment | undefined) {
    this.addReview.emit(appointment);
  }
}
