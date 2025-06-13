import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, FormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReservationAppointmentsComponent } from '../reservation-appointments/reservation-appointments.component';

@Component({
  selector: 'app-reservation-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    ReactiveFormsModule],
  templateUrl: './reservation-dialog.component.html',
  styleUrl: './reservation-dialog.component.css'
})
export class ReservationDialogComponent {
  reservationForm: FormGroup;
  /**
   *
   */
  constructor(public dialogRef: MatDialogRef<ReservationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog) {
    this.reservationForm = new FormGroup({
      id: new FormControl(data.id || ''),
      date: new FormControl(data.date || '', [Validators.required]),
      startTime: new FormControl(data.startTime || '', [Validators.required]),
      endTime: new FormControl(data.endTime || '', [Validators.required]),
      maxAppointments: new FormControl(data.maxRes || '', [Validators.required, Validators.min(1)])
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onSaveClick(): void {
    if (this.reservationForm.valid) {
      this.dialogRef.close(this.reservationForm.value);
    }
  }
  onDeleteClick(): void {
    this.dialogRef.close({ action: 'delete', id: this.reservationForm.value.id });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ReservationAppointmentsComponent, {
      width: '600px',
      height: 'auto',
      panelClass: 'dialog-container',
      data: {
        id: this.data.id,
        date: this.data.date,
      }
    });
  }
}
