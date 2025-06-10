import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { Doctor } from '../interfaces/doctor.interface';
import { Schedule } from '../interfaces/Schedule.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  constructor( private http: HttpClient,private api: ApiService) { }
  getDoctors(): Observable<Doctor[]> {
    return this.api.getDoctors();
  }
  getProfile(id?: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${environment.apiUrl}/Doctor/${id? `Profile/${id}` : 'UserProfile'}`);
  }
  uploadPhoto(file: File): Observable<Doctor> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.put<Doctor>(`${environment.apiUrl}/Doctor/ChangePhoto`, formData);
  }
  updateSchedule(schedule: Schedule): Observable<Doctor> {
    return this.http.put<Doctor>('', schedule);
  }
  updateProfile(data: any): Observable<Doctor> {
    console.log('Updating profile with data:', data, JSON.stringify(data));
    
    return this.http.put<Doctor>(`${environment.apiUrl}/Doctor`, data).pipe(
      catchError(error => {
        return throwError(() => {
          return new Error(error.error || 'An error occurred while updating the profile.');
        });
      })
    );
  }
  addReservation(reservation: any): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/Doctor/reservations`, reservation);
  }
  getReservations(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Doctor/reservations?doctorId=${id}`);
  }
  editReservation(reservation: any): Observable<void> {
    console.log('Editing reservation:', reservation);
    
    return this.http.put<void>(`${environment.apiUrl}/Doctor/reservations`, reservation);
  }
  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/Doctor/reservations?id=${id}`).pipe(
      catchError(error => {
        return throwError(() => {
          return new Error(error.error || 'An error occurred while deleting the reservation.');
        });
      })
    )
  }
  getAppoinments(reservationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Doctor/reservations/appointments?reservationId=${reservationId}`);
  }
  addPrescription(reservationId: number, appointmentId: number, prescription: any): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/Doctor/reservations/prescription?reservationId=${reservationId}&appointmentId=${appointmentId}`, prescription);
  }
  getReviews(doctorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Doctor/reviews?docID=${doctorId}&page=1&pageSize=50`);
  }
}
