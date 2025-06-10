import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyService {
  constructor(private api: ApiService) { }

  isLoading = signal<boolean>(false);

  getSpecialties(): Observable<any[]> {
    return this.api.getSpecialties();
  }

  // getDoctorsCountBySpecialty(): Observable<any> {
  //   return this.api.getDoctorsCountBySpecialty();
  // }
}