import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap, map, catchError, of, Observable } from 'rxjs';
import { Governorate } from '../enums/governorate.enum';
import { Doctor, DoctorResponse } from '../interfaces/doctor';
import { reservation, ReservationResponse } from '../interfaces/reservation';
import { environment } from '../environments/environment';
import { Specialities } from '../enums/speciality.enum';
import { Gender } from '../enums/gender.enum';
import { effect } from '@angular/core';
import { DoctorListComponent } from '../../components/pages/search/doctor-list/doctor-list.component';
@Injectable({ providedIn: 'root' })
export class DoctorReservationService {

  // Base URL for the doctor API
    private readonly apiUrl = `${environment.apiUrl}/doctor/reservations`;
    private http = inject(HttpClient);

  // Signal containing all doctors
//   doctors = signal<Doctor[]>([]);
    isLoading = signal<boolean>(false);
//   currentPage = signal<number>(1);
//   totalDoctors = signal<number>(0);
//   numberOfPages = signal<number>(0);
//   numberOfRecords = signal<number>(0);
//   maxPages = signal<number>(0);
//   pageSize = signal<number>(6);
//   pageIndex = signal<number>(1);

//   doctorName = signal<string>('');
//   speciality = signal<Specialities>(Specialities.All);
//   governorate = signal<Governorate>(Governorate.All);
//   gender = signal<Gender>(Gender.All);
//   waitingTime = signal<number>(60);
//   minPrice = signal<number>(0);
//   maxPrice = signal<number>(1000);
//   pageIndexSource = signal<string>(''); // 'list', 'filter', etc.


getReservations(doctorId: number = 1): Observable<ReservationResponse> {
    return this.http.get<any[]>(`${this.apiUrl}?doctorId=${doctorId}`).pipe(
        map((response: any[]) => ({
            reservations: response.map(res => ({
                ResId: res.id,
                DoctorId: res.doctorID,
                Day: res.day,
                StartTime: res.startTime,
                EndTime: res.endTime,
                IsAvailable: res.isAvailable
            }))
        })),
        catchError(error => {
            console.error('Error fetching reservations:', error);
            throw error;
        })
    );
}

}