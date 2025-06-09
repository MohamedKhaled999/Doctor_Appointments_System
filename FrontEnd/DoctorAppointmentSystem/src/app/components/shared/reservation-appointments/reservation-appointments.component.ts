import { Component, Inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { DoctorService } from '../../../core/services/doctor.service';
import { Appointment } from '../../../core/interfaces/appoinments.interface';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-reservation-appointments',
  imports: [],
  templateUrl: './reservation-appointments.component.html',
  styleUrl: './reservation-appointments.component.css'
})
export class ReservationAppointmentsComponent implements OnInit {
  reservationId: number;
  appointments: Appointment[] | undefined;
  fileError: string | undefined;
  /**
   *
   */
  constructor(private doctorService: DoctorService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.reservationId = data.id;
  }
  ngOnInit(): void {

  }
}
