import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent, RouterLink, RouterModule} from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgbCollapse, CommonModule ,RouterLink ,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isHome = false;
  isCollapsed = true;
  isAuthenticated = false;
  userRole = '';

  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {
 
    window.addEventListener("scroll", function () {
      const header = document.getElementsByTagName("header")[0];
      const nav = document.getElementsByTagName("nav")[0];
      if (!header || !nav) return;

      const length =
        header.scrollHeight -
        window.pageYOffset -
        nav.offsetHeight;

      if (length < 0) {
        nav.classList.replace("py-1", "py-2");
        nav.classList.replace("bg-primary-color-75", "bg-primary-color");
      } else {
        nav.classList.replace("py-2", "py-1");
        nav.classList.replace("bg-primary-color", "bg-primary-color-75");
      }
    });
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.isHome = event.url === '/';
      }
    });

    this.authService.isAuthenticated$?.subscribe(auth => {
      if (auth !== undefined) {
        this.isAuthenticated = auth;
        if (auth) {
          this.userRole = this.authService.getUserRole(); 
        }
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
