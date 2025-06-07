import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, FormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';

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
  constructor(public dialogRef: MatDialogRef<ReservationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.reservationForm = new FormGroup({
      id: new FormControl(''),
      date: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      maxAppointments: new FormControl('', [Validators.required, Validators.min(1)])
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
  onCancelClick(): void {
    this.dialogRef.close();
  }
}
