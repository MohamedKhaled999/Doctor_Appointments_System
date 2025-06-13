import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../interfaces/patient.interface';
import { environment } from '../environments/environment';
import { Appointment } from '../interfaces/appoinments.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private http: HttpClient) {}
  getProfile(): Observable<Patient> {
    return this.http.get<Patient>(`${environment.apiUrl}/Patient`);
  }
  updateProfile(patient: { id: number; firstName: any; lastName: any; email: any; phoneNumber: any; governorate: number; birthDate: any; }): Observable<Patient> {
    return this.http.put<Patient>(`${environment.apiUrl}/Patient`, patient);
  }
  addFilesToAppointment(appointmentId: number, formData: FormData): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/patient/appointments/docs?appointmentId=${appointmentId}`, formData);
  }
  deleteFileFromAppointment(appointmentId: number, fileName: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/patient/appointments/docs?appointmentId=${appointmentId}&documentUrl=${fileName}`);
  }
  getAppoinments(pageIndex: number, pageSize: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${environment.apiUrl}/Patient/Appointments?pageIndex=${pageIndex}&pageSize=${pageSize}`);
  }
  cancelAppoinment(appointmentId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/Patient/Appointments?id=${appointmentId}`);
  }
  addReview(review: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Patient/appointments/Review`, review);
  }
}
