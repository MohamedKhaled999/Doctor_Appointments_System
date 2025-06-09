import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { DataManagementService } from './data-management.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router,
  private dataServsice: DataManagementService
) {

    if (isPlatformBrowser(this.platformId)) {
      // const token = localStorage.getItem('userToken');
      // this.isAuthenticatedSubject.next(!!token);
    }
  }


  getUserRole(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userRole') || '';
    }
    return '';  
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('rememberMe');

    }
    // this.isAuthenticatedSubject.next(false);
    this.dataServsice.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }

  // Other authentication methods such as login() or register() can be added here
}

//   constructor(@Inject(PLATFORM_ID) private platformId: Object) {
//     if (isPlatformBrowser(this.platformId)) {
//       this.token = localStorage.getItem('token');
//     }