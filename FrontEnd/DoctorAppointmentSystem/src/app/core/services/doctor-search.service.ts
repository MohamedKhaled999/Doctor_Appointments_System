import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap, map, catchError, of, Observable } from 'rxjs';
import { Governorate } from '../enums/governorate.enum';
import { Doctor, DoctorResponse } from '../interfaces/doctor';
import { reservation } from '../interfaces/reservation';
import { environment } from '../environments/environment';
import { Specialities } from '../enums/speciality.enum';
import { Gender } from '../enums/gender.enum';
import { effect } from '@angular/core';
import { DoctorListComponent } from '../../components/pages/search/doctor-list/doctor-list.component';
@Injectable({ providedIn: 'root' })
export class DoctorSearchService {

  // Base URL for the doctor API
   private readonly apiUrl = `${environment.apiUrl}/Doctor/search`;
  private http = inject(HttpClient);

  // Signal containing all doctors
  doctors = signal<Doctor[]>([]);
  isLoading = signal<boolean>(false);
  currentPage = signal<number>(1);
  totalDoctors = signal<number>(0);
  numberOfPages = signal<number>(0);
  numberOfRecords = signal<number>(0);
  maxPages = signal<number>(0);
  pageSize = signal<number>(6);
  pageIndex = signal<number>(1);

  doctorName = signal<string>('');
  speciality = signal<Specialities>(Specialities.All);
  governorate = signal<Governorate>(Governorate.All);
  gender = signal<Gender>(Gender.All);
  waitingTime = signal<number>(60);
  minPrice = signal<number>(0);
  maxPrice = signal<number>(1000);
  pageIndexSource = signal<string>(''); // 'list', 'filter', etc.

  // Signal for loading state
  // isLoading = signal(false);
  
  // Signal for error state
  // error = signal<string | null>(null);

  // // Fetch all doctors
  // fetchDoctors() {
  //   this.isLoading.set(true);
  //   this.error.set(null);

  //   this.http.get<any[]>(`${this.apiUrl}/search`).pipe(
  //     map(response => this.transformDoctors(response)),
  //     tap(doctors => {
  //       this.doctors.set(doctors);
  //       this.isLoading.set(false);
  //     }),
  //     catchError(err => {
  //       this.error.set(err.message || 'Failed to fetch doctors');
  //       this.isLoading.set(false);
  //       return of([]);
  //     })
  //   ).subscribe();
  // }


  getFilteredDoctorsWithPagination(page: number = 1, pageSize: number = 6, doctorName: string = '', speciality: Specialities = Specialities.All, governorate: Governorate = Governorate.All, gender : Gender = Gender.All, waitingTime: number = 0, minPrice: number = 0, maxPrice: number = 1000): Observable<DoctorResponse> {

    
    if( !doctorName && waitingTime === 0 && minPrice === 0 && maxPrice === 1000) {  // If no filters are applied, return all doctors with pagination
      console.log(`getting all doctors ,PageNum=${page}&PageSize=${pageSize}&Name=${doctorName}&gender=${gender}&Speciality=${speciality}&Governorate=${governorate}&WaitingTime=${waitingTime}&MinPrice=${minPrice}&MaxPrice=${maxPrice}`);
      
      return this.getAllDoctorsWithPagination(page, pageSize);
    }
    else if ( doctorName === '') {
      console.log(`${this.apiUrl}?PageNum=${page}&PageSize=${pageSize}&Speciality=${speciality}&Governorate=${governorate}&gender=${gender}&WaitingTime=${waitingTime}&MinPrice=${minPrice}&MaxPrice=${maxPrice}`);
      
      return this.http.get(`${this.apiUrl}?PageNum=${page}&PageSize=${pageSize}&Speciality=${speciality}&Governorate=${governorate}&gender=${gender}&WaitingTime=${waitingTime}&MinPrice=${minPrice}&MaxPrice=${maxPrice}`).pipe(
        map((response: any) => ({
          results: response.doctors.map((doctor: any) => this.transformDoctors([doctor])[0]),
          total_pages: response.totalPageNumber,
          total_results: response.total_results,
          page: response.page
        })),
        catchError(error => {
          console.error('Error fetching doctors:', error);
            throw error;
            })
          );
    }
    else {
      console.log(`${this.apiUrl}?PageNum=${page}&PageSize=${pageSize}&Name=${doctorName}&Speciality=${speciality}&Governorate=${governorate}&gender=${gender}&WaitingTime=${waitingTime}&MinPrice=${minPrice}&MaxPrice=${maxPrice}`);

      return this.http.get(`${this.apiUrl}?PageNum=${page}&PageSize=${pageSize}&Name=${doctorName}&Speciality=${speciality}&Governorate=${governorate}&gender=${gender}&WaitingTime=${waitingTime}&MinPrice=${minPrice}&MaxPrice=${maxPrice}`).pipe(
      map((response: any) => ({
        results: response.doctors.map((doctor: any) => this.transformDoctors([doctor])[0]),
        total_pages: response.totalPageNumber,
        total_results: response.total_results,
        page: response.page
      })),
      catchError(error => {
        console.error('Error fetching doctors:', error);
          throw error;
          })
        );
      }
    }
  

  getAllDoctorsWithPagination(page: number = 1, pageSize: number = 6): Observable<DoctorResponse> {
    return this.http.get(`${this.apiUrl}?PageNum=${page}&PageSize=${pageSize}`).pipe(
      map((response: any) => ({
        results: response.doctors.map((doctor: any) => this.transformDoctors([doctor])[0]),
        total_pages: response.totalPageNumber,
        total_results: response.total_results,
        page: response.page
      })),
      catchError(error => {
        console.error('Error fetching doctors:', error);
          throw error;
        })
      );
  }

  // Transform API response to Doctor interface
  private transformDoctors(apiDoctors: any[]): Doctor[] {
    return apiDoctors.map(doctor => ({
      id: doctor.id,
      name: `${doctor.name}`,
      profilePictureUrl: doctor.image || undefined,
      title: doctor.title || 'General Practitioner',
      qualifications: doctor.qualifications?.split(',') || [],
      fees: doctor.fees || 0,
      specializations: doctor.specialty || [],
      rating: doctor.rating || 0,
      waitingTime: doctor.waitingTime || 0,
      governorate: Governorate[doctor.governorate].toString() || 'Governorate is Unknown',
      location: doctor.location || 'Location is Unknown',
      phone: doctor.phone || 'Not available',
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