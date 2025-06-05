import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../core/environments/environment'
import { Observable } from 'rxjs';
import { LoginResponse } from '../../core/interfaces/login-response.mode';
import { ForgetPasswordVM } from '../models/forget-password.model';
import { ResetPasswordVM } from '../models/reset-password.model';
import { ChangePassword } from '../interfaces/change-password';
import { tap } from 'rxjs/operators'; 
import { Router } from '@angular/router';
import { Login } from '../interfaces/login';
import { AuthResponse } from '../interfaces/auth-response';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly apiUrl = `${environment.apiUrl}/authentication`;

  constructor(private http: HttpClient ,private router: Router) {}


  login(email: string, password: string): Observable<AuthResponse> {
    const body: Login = { email, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, body);
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
  changePassword(changePasswordData: ChangePassword): Observable<any> {
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

    externalLogin(externalData:any): Observable<AuthResponse> {
    // This method is used to handle external login (e.g., Google, Facebook, etc.)
    // It sends the external login data to the backend for authentication.
    return this.http.post<AuthResponse>(`${this.apiUrl}/external-login`, externalData);
  }
}


