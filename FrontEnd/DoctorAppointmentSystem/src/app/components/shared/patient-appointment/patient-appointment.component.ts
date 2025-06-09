import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../../core/interfaces/appoinments.interface';
import Swal from 'sweetalert2';
import { PatientService } from '../../../core/services/patient.service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewDialogComponent } from '../review-dialog/review-dialog.component';
import { NotificationsComponent } from "../notifications/notifications.component";

@Component({
  selector: 'app-patient-appointment',
  imports: [CommonModule],
  templateUrl: './patient-appointment.component.html',
  styleUrl: './patient-appointment.component.css'
})
export class PatientAppointmentComponent {
  acceptedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
  fileErrors: string[] | null = null;
  selectedFiles: File[] = [];
  maxFileSize = 5 * 1024 * 1024;
  @Input() appointment: Appointment | undefined;
  @Output() cancelAppointment = new EventEmitter();
  @Output() addReview = new EventEmitter<Appointment>();
  /**
   *
   */
  constructor(private patientService: PatientService, private matDialog: MatDialog) {
    console.log('PatientAppointmentComponent initialized with appointment:', this.appointment);
  }
  get isPast() {
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
      if (result.isConfirmed) {
        if (this.appointment) {
          this.patientService.cancelAppoinment(this.appointment.id).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Appointment cancelled successfully',
                color: '#004085',
                confirmButtonColor: '#004085'
              });
              this.cancelAppointment.emit();
            },
            error: (error) => {
              console.error('Error cancelling appointment:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error cancelling appointment',
                text: error.error.message || 'An error occurred while cancelling the appointment.',
                color: '#004085',
                confirmButtonColor: '#004085'
              });
            }
          });
        }
      }
    });
  }
  onAddReview(appointment: Appointment | undefined) {
    this.openDialog();
  }
  openDialog() {
    const dialogRef = this.matDialog.open(ReviewDialogComponent, {
      width: '400px',
      height: '400px',
      panelClass: 'dialog-container',
      data: {
        appId: this.appointment?.id,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog closed with result:', result);
        
      }
    });
  }
  onFileSelected(event: Event) {
    this.fileErrors = null;
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      const invalidFiles = files.filter(file => !this.acceptedFileTypes.includes(file.type) || file.size > this.maxFileSize);
      if (invalidFiles.length > 0) {
        this.fileErrors = invalidFiles.map(file => {
          let error = `${file.name} is not a valid file type or exceeds the size limit of 5MB.`;
          if (!this.acceptedFileTypes.includes(file.type)) {
            error += ` Allowed file types: ${this.acceptedFileTypes.join(', ')}.`;
          }
          return error;
        });
        return;
      }
      this.selectedFiles = files;
      input.value = '';
    } else {
      this.fileErrors = ['No files selected.'];
    }
    if (this.selectedFiles.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('document', this.selectedFiles[i], this.selectedFiles[i].name);
      }
      if (this.appointment) {
        this.patientService.addFilesToAppointment(this.appointment.id, formData).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Files added successfully',
              color: '#004085',
              confirmButtonColor: '#004085'
            });
            this.selectedFiles = [];
          },
          error: (error) => {
            console.error('Error adding files:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error adding files',
              text: error.error.message || 'An error occurred while adding files.',
              color: '#004085',
              confirmButtonColor: '#004085'
            });
          }
        });
    }
    }
  }
}
