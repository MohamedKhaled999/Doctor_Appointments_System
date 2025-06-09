import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private token: string | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('userToken');
      this.isAuthenticatedSubject.next(!!token);
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
    }
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/']);
  }

  // Other authentication methods such as login() or register() can be added here
}

//   constructor(@Inject(PLATFORM_ID) private platformId: Object) {
//     if (isPlatformBrowser(this.platformId)) {
//       this.token = localStorage.getItem('token');
//     }