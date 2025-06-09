// src/app/core/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getHomeData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/home`);
  }

  // Updated to use the correct endpoint structure
  getSpecialties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/home`).pipe(
      map((data: any) => data.specialties || []) // Extract specialties from home data
    );
  }

  // Updated to use the correct endpoint structure
  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/home`).pipe(
      map((data: any) => data.doctors || []) // Extract doctors from home data
    );
  }
}