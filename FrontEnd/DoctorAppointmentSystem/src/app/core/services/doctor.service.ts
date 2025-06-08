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

  getDoctorById(id: number): Observable<Doctor> {
    return this.api.getDoctorById(id);
  }

  searchDoctors(specialty?: string): Observable<Doctor[]> {
    const params: any = {};
    if (specialty) params.speciality = specialty;
    return this.api.searchDoctors(params);
  }
}