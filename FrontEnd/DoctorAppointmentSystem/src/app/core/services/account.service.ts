import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../core/environments/environment'
import { Observable } from 'rxjs';
import { LoginResponse } from '../../core/interfaces/login-response.mode';
import { ForgetPasswordVM } from '../models/forget-password.model';
import { ResetPasswordVM } from '../models/reset-password.model';
import { ChangePasswordVM } from '../models/change-password.model';
import { tap } from 'rxjs/operators'; 
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly apiUrl = `${environment.apiUrl}/account`;

  constructor(private http: HttpClient ,private router: Router) {}


  login(email: string, password: string, rememberMe: boolean): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { 
      email, 
      password,
      rememberMe 
    });
  }


  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }
  forgotPassword(forgetPasswordData: ForgetPasswordVM): Observable<any> {
    return this.http.post(`${this.apiUrl}/forget-password`, forgetPasswordData);
  }
  resetPassword(resetData: ResetPasswordVM): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, resetData);
  }
  changePassword(changePasswordData: ChangePasswordVM): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, changePasswordData);
  }
  registerDoctor(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/doctor-register`, formData);
  }
  
  getSpecialties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/specialties`);
  }
  register(registerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerData).pipe(
      tap(() => {
        this.router.navigate(['/need-to-confirm']);
      })
    );
  }
}

