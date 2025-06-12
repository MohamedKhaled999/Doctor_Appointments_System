import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { DashboardData } from '../interfaces/AdminDashboard.interface';
import { environment } from '../environments/environment';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  constructor(private http: HttpClient) {}
  private readonly apiUrl = `${environment.apiUrl}/Admin`;

  getDashboardData(): Observable<DashboardData> {
    return this.http.get(`${this.apiUrl}/FullDashBoard`).pipe(
      map((response:any) => ({
        overview: response.overview,
        monthlyStats: response.monthlyStats,
        specialtyDistribution: response.specialtyDistribution,
        appointmentStatus: response.appointmentStatus,
        topDoctors: response.topDoctors,
        recentAppointments: response.recentAppointments,
        unApprovedDoctors: response.unApprovedDoctors
      })),
      catchError(error => {
        console.error('Error fetching doctors:', error);
          throw error;
        })
    );
    // Replace with actual API call
    // return this.http.get<DashboardData>(this.apiUrl);
    
    // Mock data for development
    // return of({
    //   overview: {
    //     totalDoctors: 156,
    //     totalPatients: 2847,
    //     totalAppointments: 1234,
    //     monthlyRevenue: 45600,
    //     growthRate: 12.5,
    //     averageRating: 4.6
    //   },
    //   monthlyStats: [
    //     { month: 'Jan', appointments: 890, revenue: 35400, patients: 245 },
    //     { month: 'Feb', appointments: 920, revenue: 38200, patients: 278 },
    //     { month: 'Mar', appointments: 1050, revenue: 42100, patients: 312 },
    //     { month: 'Apr', appointments: 1180, revenue: 45600, patients: 345 },
    //     { month: 'May', appointments: 1234, revenue: 48900, patients: 389 },
    //     { month: 'Jun', appointments: 1150, revenue: 46200, patients: 356 }
    //   ],
    //   specialtyDistribution: [
    //     { name: 'Cardiology', value: 35, color: '#3B82F6' },
    //     { name: 'Dermatology', value: 28, color: '#10B981' },
    //     { name: 'Neurology', value: 22, color: '#F59E0B' },
    //     { name: 'Orthopedics', value: 18, color: '#EF4444' },
    //     { name: 'Pediatrics', value: 15, color: '#8B5CF6' },
    //     { name: 'Others', value: 12, color: '#6B7280' }
    //   ],
    //   appointmentStatus: [
    //     { status: 'Completed', count: 856, color: '#10B981' },
    //     { status: 'Scheduled', count: 234, color: '#3B82F6' },
    //     { status: 'Cancelled', count: 89, color: '#EF4444' },
    //     { status: 'Rescheduled', count: 55, color: '#F59E0B' }
    //   ],
    //   topDoctors: [
    //     { id: 1, name: 'Dr. Ahmed Hassan', specialty: 'Cardiology', rating: 4.9, appointments: 145, revenue: 14500 },
    //     { id: 2, name: 'Dr. Fatma Ali', specialty: 'Dermatology', rating: 4.8, appointments: 132, revenue: 13200 },
    //     { id: 3, name: 'Dr. Mohamed Saad', specialty: 'Neurology', rating: 4.7, appointments: 128, revenue: 12800 },
    //     { id: 4, name: 'Dr. Nour Ibrahim', specialty: 'Pediatrics', rating: 4.6, appointments: 115, revenue: 11500 },
    //     { id: 5, name: 'Dr. Omar Khaled', specialty: 'Orthopedics', rating: 4.5, appointments: 108, revenue: 10800 }
    //   ],
    //   recentAppointments: [
    //     { id: 1, patient: 'Sara Ahmed', doctor: 'Dr. Ahmed Hassan', date: '2024-06-04', time: '10:00 AM', status: 'Completed' },
    //     { id: 2, patient: 'Mohamed Ali', doctor: 'Dr. Fatma Ali', date: '2024-06-04', time: '11:30 AM', status: 'Scheduled' },
    //     { id: 3, patient: 'Amira Hassan', doctor: 'Dr. Mohamed Saad', date: '2024-06-04', time: '02:00 PM', status: 'Scheduled' },
    //     { id: 4, patient: 'Khaled Omar', doctor: 'Dr. Nour Ibrahim', date: '2024-06-04', time: '03:30 PM', status: 'Cancelled' },
    //     { id: 5, patient: 'Layla Mostafa', doctor: 'Dr. Omar Khaled', date: '2024-06-04', time: '04:00 PM', status: 'Completed' }
    //   ]
    // });
    

    
  }
}