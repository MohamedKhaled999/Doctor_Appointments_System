import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../interfaces/doctor.interface';
import { Schedule } from '../interfaces/Schedule.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  options = {
    headers: {
      'Authorization': ''
    }
  };
  constructor(private http: HttpClient) {
  }
  
  getProfile(id?: number): Observable<Doctor> {
    this.options.headers['Authorization'] = `Bearer ${localStorage.getItem('userToken')}`;
    return this.http.get<Doctor>(`${environment.apiUrl}/Doctor/${id? `?id=${id}` : 'UserProfile'}`, this.options);
  }
  uploadPhoto(file: File): Observable<Doctor> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.post<Doctor>(``, formData);
  }
  updateSchedule(schedule: Schedule): Observable<Doctor> {
    return this.http.put<Doctor>('', schedule);
  }
  updateProfile(formData: FormData): Observable<Doctor> {
    return this.http.put<Doctor>(``, formData);
  }
  addReservation(reservation: any): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/Doctor/reservations`, reservation);
  }
  getReservations(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Doctor/reservations?id=${id}`, this.options);
  }
}
