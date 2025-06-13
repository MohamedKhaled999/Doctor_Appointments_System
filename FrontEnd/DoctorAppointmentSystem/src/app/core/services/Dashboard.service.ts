// 

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { DashboardData } from '../interfaces/AdminDashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  constructor(private http: HttpClient) {}
  private readonly apiUrl = 'https://doc-net2.runasp.net/api/Admin';

  getDashboardData(): Observable<DashboardData> {
    console.log('Fetching dashboard data from API:', `${this.apiUrl}/FullDashBoard`)
    return this.http.get(`${this.apiUrl}/FullDashBoard`).pipe(
      map((response:any) => ({
        overview: response.overview,
        monthlyStats: response.monthlyStats,
        specialtyDistribution: response.specialtyDistribution,
        appointmentStatus: response.appointmentStatus,
        topDoctors: response.topDoctors,
        recentAppointments: response.recentAppointments,
        unApprovedDoctor: response.unApprovedDoctors
      })),
      catchError(error => {
        console.error('Error fetching doctors:', error);
          throw error;
        })
    );}
    approveDoctor(doctorId: number): Observable<any> {
    const url = `${this.apiUrl}/ApproveDoctor?doctorId=${doctorId}`;
    return this.http.post(url, null); // POST request with no body
  }
}
