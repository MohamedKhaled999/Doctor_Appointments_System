import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap, map, catchError, of } from 'rxjs';
import { Doctor } from '../interfaces/doctor';
import { reservation } from '../interfaces/reservation';
@Injectable({ providedIn: 'root' })
export class DoctorService {

  private readonly baseUrl = '/api/doctors';
  private http = inject(HttpClient);

  // Signal containing all doctors
  doctors = signal<Doctor[]>([]);
  
  // Signal for loading state
  isLoading = signal(false);
  
  // Signal for error state
  error = signal<string | null>(null);

  // Fetch all doctors
  fetchDoctors() {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.get<any[]>(`${this.baseUrl}/search`).pipe(
      map(response => this.transformDoctors(response)),
      tap(doctors => {
        this.doctors.set(doctors);
        this.isLoading.set(false);
      }),
      catchError(err => {
        this.error.set(err.message || 'Failed to fetch doctors');
        this.isLoading.set(false);
        return of([]);
      })
    ).subscribe();
  }

  // Transform API response to Doctor interface
  private transformDoctors(apiDoctors: any[]): Doctor[] {
    return apiDoctors.map(doctor => ({
      id: doctor.id,
      name: `${doctor.firstName} ${doctor.lastName}`,
      profilePictureUrl: doctor.imageUrl || undefined,
      title: doctor.title || 'General Practitioner',
      qualifications: doctor.qualifications?.split(',') || [],
      fees: doctor.consultationFee || 0,
      specializations: doctor.specialties || [],
      rating: doctor.averageRating || 0,
      waitingTime: doctor.avgWaitingTimeMinutes || 30,
      governorate: doctor.location?.governorate || 'Unknown',
      location: doctor.location?.city || 'Unknown',
      phone: doctor.phoneNumber || 'Not available',
      reservations: []

    //   reservations: doctor.appointments?.map((a: any) => this.transformReservation(a)) || []
    }));
  }

//   private transformReservation(apiReservation: any): reservation {
//     return {
//       // Map reservation fields according to your reservation interface
//       id: apiReservation.id,
//       date: new Date(apiReservation.dateTime),
//       status: apiReservation.status,
//       // ... other reservation fields
//     };
//   }

//   // Get single doctor by ID (using toSignal for reactive approach)
//   getDoctorById(id: number) {
//     return toSignal(
//       this.http.get<any>(`/api/doctors/${id}`).pipe(
//         map(doctor => this.transformDoctors([doctor])[0])
//       ),
//       { initialValue: null }
//     );
//   }
}