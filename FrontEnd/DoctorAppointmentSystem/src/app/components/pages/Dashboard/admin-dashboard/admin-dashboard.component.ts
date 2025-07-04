import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from '../overview/overview.component';
import { DashboardService } from '../../../../core/services/Dashboard.service';
import { DashboardData } from '../../../../core/interfaces/AdminDashboard.interface';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { DashboardAppoimentsComponent } from '../dashboard-appoiments/dashboard-appoiments.component';
import { DashboardDoctorsComponent } from '../dashboard-doctors/dashboard-doctors.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { AddSpecialityDialogComponent } from '../add-speciality-dialog/add-speciality-dialog.component';
@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, SideNavComponent, OverviewComponent, DashboardAppoimentsComponent, DashboardDoctorsComponent, AddSpecialityDialogComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  animations: [
    trigger('sidebarAnimation', [
      transition('expanded <=> collapsed', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class AdminDashboardComponent implements OnInit {
  currentTime = new Date().toLocaleString();
  sidebarState: 'expanded' | 'collapsed' = 'expanded';
  // ... rest of your existing properties

  // toggleSidebar() {
  //   this.sidebarState = this.sidebarState === 'expanded' ? 'collapsed' : 'expanded';
  // }
  activeSection: string = 'overview';
  dashboardData: DashboardData | null = null; // Initialize as null
  isLoading: boolean = true; // Track loading state

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardData().subscribe({
      next: (data: DashboardData) => {
        console.log('Dashboard Data Loaded:', data);
        this.dashboardData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      }
    });
  }

  onSectionChange(section: string): void {
    this.activeSection = section;
  }

  getSectionTitle(): string {
    const titles: { [key: string]: string } = {
      'overview': 'Dashboard Overview',
      'appointments': 'Appointments Management',
      'doctors': 'Doctors Management',
      'speciality': 'Speciality Management',
      'patients': 'Patients Management',
      'revenue': 'Revenue Analytics',
      'analytics': 'Advanced Analytics'
    };
    return titles[this.activeSection] || 'Dashboard';
  }

  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;

    // Manually handle Bootstrap offcanvas for desktop
    if (window.innerWidth >= 992) {
      const sidebar = document.getElementById('dashboardSidebar');
      sidebar?.classList.toggle('collapsed');
    }
  }

  // Optional: Close sidebar when navigating on mobile
  // onSectionChange(section: string) {
  //   this.activeSection = section;
  //   if (window.innerWidth < 992) {
  //     this.sidebarOpen = false;
  //     const offcanvas = bootstrap.Offcanvas.getInstance('#dashboardSidebar');
  //     offcanvas?.hide();
  //   }
  // }

}