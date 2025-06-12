import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from '../overview/overview.component';
import { DashboardService } from '../../../../core/services/Dashboard.service';
import { DashboardData } from '../../../../core/interfaces/AdminDashboard.interface';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { DashboardAppoimentsComponent } from '../dashboard-appoiments/dashboard-appoiments.component';
import { DashboardDoctorsComponent } from '../dashboard-doctors/dashboard-doctors.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule,SideNavComponent,OverviewComponent,DashboardAppoimentsComponent,DashboardDoctorsComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  activeSection: string = 'overview';
  dashboardData: DashboardData | null = null; // Initialize as null
  isLoading: boolean = true; // Track loading state

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardData().subscribe({
      next: (data: DashboardData) => {
        // console.log('Dashboard Data Loaded:', data);
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
      'patients': 'Patients Management',
      'revenue': 'Revenue Analytics',
      'analytics': 'Advanced Analytics'
    };
    return titles[this.activeSection] || 'Dashboard';
  }

  getCurrentTime(): string {
    return new Date().toLocaleString();
  }
}