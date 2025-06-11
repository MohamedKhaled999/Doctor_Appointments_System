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
import { Specialty } from '../interfaces/specialty.interface';
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
  speciality = signal<Specialty[]>([]);
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


  getFilteredDoctorsWithPagination(page: number = 1, pageSize: number = 6, doctorName: string = '', speciality: Specialty[] = [], governorate: Governorate = Governorate.All, gender : Gender = Gender.All, waitingTime: number = 0, minPrice: number = 0, maxPrice: number = 1000): Observable<DoctorResponse> {

    
    if( !doctorName && waitingTime === 0 && minPrice === 0 && maxPrice === 1000) {  // If no filters are applied, return all doctors with pagination
      console.log(`getting all doctors ,PageNum=${page}&PageSize=${pageSize}&Name=${doctorName}&gender=${gender}&Governorate=${governorate}&WaitingTime=${waitingTime}&MinPrice=${minPrice}&MaxPrice=${maxPrice}`);
      
      return this.getAllDoctorsWithPagination(page, pageSize);
    }
  let specialtyArray: any[] = [];
  if (Array.isArray(speciality)) {
    specialtyArray = speciality;
  } else if (speciality !== undefined && speciality !== null && speciality !== '') {
    specialtyArray = [speciality];
  }

  // Build query params dynamically
  const params: any = {
    PageNum: page,
    PageSize: pageSize,
    Name: doctorName,
    Specialty: specialtyArray.map(s => typeof s === 'object' ? s.id : s),
    Governorate: governorate,
    gender: gender,
    WaitingTime: waitingTime,
    MinPrice: minPrice,
    MaxPrice: maxPrice
  };

  // Remove empty or default params to keep the URL clean
  if (!doctorName) delete params.Name;
  if (!speciality || speciality.length === 0) delete params.Specialty;
  if (governorate === Governorate.All) delete params.Governorate;
  if (gender === Gender.All) delete params.gender;
  if (!waitingTime) delete params.WaitingTime;
  if (!minPrice) delete params.MinPrice;
  if (maxPrice === 1000) delete params.MaxPrice;

  // Build query string
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(Array.isArray(value) ? value.join(',') : String(value))}`)
    .join('&');

  console.log(`${this.apiUrl}?${queryString}`);

  return this.http.get(`${this.apiUrl}?${queryString}`).pipe(
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
      specializations: Array.isArray(doctor.speciality)
        ? doctor.speciality
        : doctor.speciality
          ? [doctor.speciality]
          : [],
      rating: doctor.rating || 0,
      waitingTime: doctor.waitingTime || 0,
      governorate: Governorate[doctor.governorate].toString() || 'Governorate is Unknown',
      location: doctor.location || 'Location is Unknown',
      phone: doctor.phone || 'Not available',
      reservations: []

    //   reservations: doctor.appointments?.map((a: any) => this.transformReservation(a)) || []
    }));
  }

loadDoctors(): void {
    this.isLoading.set(true);
    this.doctors.set([]);
    this.getFilteredDoctorsWithPagination(this.currentPage()
    , this.pageSize()
    , this.doctorName()
    , this.speciality()
    , this.governorate()
    , this.gender()
    , this.waitingTime()
    , this.minPrice()
    , this.maxPrice()).subscribe({
      next: (response) => {
        this.doctors.set(response.results);
        console.log('Doctors loaded:', this.doctors());
        this.numberOfPages.set(response.total_pages);
        console.log('Total pages:', this.numberOfPages());
        this.numberOfRecords.set(this.numberOfPages() * this.pageSize());
        this.totalDoctors.set(response.total_results);
        this.pageIndex.set(response.page);
        this.isLoading.set(false);
        console.log("Tracing: Doctors loaded:", this.doctors());
        console.log("Tracing: Total pages:", this.numberOfPages());
        console.log("Tracing: Number of records:", this.numberOfRecords());
        console.log("Tracing: Total doctors:", this.totalDoctors());
        console.log("Tracing: Current page index:", this.pageIndex());

      },
      error: (error) => {
        console.error('Error fetching doctors:', error);
        this.isLoading.set(false);
      }
    });
  }
}