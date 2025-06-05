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
import { Register } from '../interfaces/register';
import { catchError } from 'rxjs/operators';
import { ForgetPassword } from '../interfaces/forget-password';

import {  HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

import { ResetPassword } from '../interfaces/reset-password';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly apiUrl = `${environment.apiUrl}/authentication`;
  private readonly api_Url = `${environment.api_Url}`;
  constructor(private http: HttpClient, private router: Router) { }


  login(email: string, password: string): Observable<AuthResponse> {
    const body: Login = { email, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, body);
  }

  confirmEmail(confirmData: { email: string; token: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm-email`, confirmData)
      .pipe(
        catchError(error => {
          let errorMessage = 'Email confirmation failed';
          if (error.error?.errors) {
            errorMessage = error.error.errors.join(', ');
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          throw new Error(errorMessage);
        })
      );
  }
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }
  // forgotPassword(forgetPasswordData: ForgetPasswordVM): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/forget-password`, forgetPasswordData);
  // }
  forgotPassword(forgetPasswordData: ForgetPassword): Observable<any> {
    return this.http.post(`${this.apiUrl}/forget-password`, forgetPasswordData);
  }
  // resetPassword(resetData: ResetPasswordVM): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/reset-password`, resetData);
  // }
  // Instead of full URL
changePassword(passwords: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/change-password`, passwords);
}
  registerDoctor(doctorData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/doctor-register`, doctorData);
  }
  // registerDoctor(doctorData: FormData): Observable<AuthResponse> {
  //   return this.http.post<AuthResponse>(`${this.apiUrl}/doctor-register`, doctorData);
  // }

  getSpecialties(): Observable<any> {
    return this.http.get(`${this.api_Url}/specialties`);
  }
  // register(registerData: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/register`, registerData).pipe(
  //     tap(() => {
  //       this.router.navigate(['/need-to-confirm']);
  //     })
  //   );
  // }
  //registerRequest
  resetPassword(resetData: ResetPassword): Observable<any> {
   
    const payload = {
      Email: resetData.email,
      Token: resetData.token,
      NewPassword: resetData.newPassword
    };

    return this.http.post(`${this.apiUrl}/reset-password`, payload)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Password reset failed';
    
    if (error.status === 0) {
      errorMessage = 'Network error: Could not connect to server.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 400) {
      errorMessage = 'Invalid or expired token';
    } else if (error.status === 404) {
      errorMessage = 'User not found';
    }

    return throwError(() => new Error(errorMessage));
  }

 
  register(request: Register): Observable<any> {
    console.log('Payload:', request);
  
    return this.http.post<any>(`${this.apiUrl}/register`, request).pipe(
      tap(() => {
        console.log('Registration successful');
        this.router.navigate(['/need-to-confirm']);
      }),
      catchError((error) => {
        console.error('Error during registration:', error);
        throw error; 
      })
    );
  }
}  