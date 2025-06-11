import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DataManagementService } from '../../core/services/data-management.service';
import { NotificationsComponent } from '../shared/notifications/notifications.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, NotificationsComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isHome = false;
  isCollapsed = true;
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(Router) public router: Router,
    @Inject(AuthService) public authService: AuthService,
    @Inject(DataManagementService) public dataService: DataManagementService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      window.addEventListener('scroll', function () {
        const header = document.getElementsByTagName('header')[0];
        const nav = document.getElementsByTagName('nav')[0];
        if (!header || !nav) return;

        const length = header.scrollHeight - window.pageYOffset - nav.offsetHeight;
        if (length < 0) {
          nav.classList.replace('py-1', 'py-2');
        } else {
          nav.classList.replace('py-2', 'py-1');
        }
      });
    }
  }

  toggleNavbar(): void {
    this.isCollapsed = !this.isCollapsed;
    if (!this.isBrowser) return;

    const nav = document.getElementById('MainNav');
    if (nav) {
      if (this.isHome && !this.isCollapsed) {
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
