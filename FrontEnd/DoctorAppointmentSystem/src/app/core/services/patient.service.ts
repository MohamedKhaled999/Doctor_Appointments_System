import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../interfaces/patient.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http: HttpClient) { }

  getProfile(): Observable<Patient> {
    return this.http.get<Patient>('');
  }
  updateProfile(patient: Patient): Observable<Patient> {
    return this.http.put<Patient>('', patient);
  }
  addFilesToAppointment(appointmentId: number, formData: FormData): Observable<any> {
    return this.http.post<any>(`/appointments/${appointmentId}/files`, formData);
  }
}
