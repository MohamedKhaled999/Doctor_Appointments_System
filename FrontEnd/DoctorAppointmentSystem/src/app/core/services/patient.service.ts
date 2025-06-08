import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../interfaces/patient.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private options = {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('userToken')}`
    }
  };
  constructor(private http: HttpClient) { }

  getProfile(): Observable<Patient> {
    return this.http.get<Patient>(`${environment.apiUrl}/Patient`, this.options);
  }
  updateProfile(patient: { id: number; firstName: any; lastName: any; email: any; phoneNumber: any; governorate: number; birthDate: any; }): Observable<Patient> {
    return this.http.put<Patient>(`${environment.apiUrl}/Patient`, patient, this.options);
  }
  addFilesToAppointment(appointmentId: number, formData: FormData): Observable<any> {
    return this.http.post<any>(`/appointments/${appointmentId}/files`, formData);
  }
}
