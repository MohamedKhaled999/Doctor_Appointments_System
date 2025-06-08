import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [NgbCollapse , CommonModule ,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isHome = false;
  isCollapsed = true;
  isAuthenticated = false;
  userRole = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHome = event.url === '/';
      }
    });

    this.authService.isAuthenticated$.subscribe(auth => {
      this.isAuthenticated = auth;
      if (auth) {
        this.userRole = this.authService.getUserRole(); // Implement this in your AuthService
      }
    });
  }

  toggleNavbar(): void {
    this.isCollapsed = !this.isCollapsed;
    const nav = document.getElementById('MainNav');
    if (nav) {
      if (this.isHome && !this.isCollapsed) {
        nav.classList.add('bg-primary-color');
        nav.classList.remove('bg-primary-color-75');
      } else if (this.isHome) {
        nav.classList.remove('bg-primary-color');
        nav.classList.add('bg-primary-color-75');
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}