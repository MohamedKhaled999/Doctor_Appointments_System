import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyService {
  constructor(private api: ApiService) { }

  getSpecialties(): Observable<any[]> {
    return this.api.getSpecialties();
  }

  // getDoctorsCountBySpecialty(): Observable<any> {
  //   return this.api.getDoctorsCountBySpecialty();
  // }
}