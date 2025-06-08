import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Doctor } from '../interfaces/doctor.interface';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  constructor(private api: ApiService) { }

  getDoctors(): Observable<Doctor[]> {
    return this.api.getDoctors();
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
}