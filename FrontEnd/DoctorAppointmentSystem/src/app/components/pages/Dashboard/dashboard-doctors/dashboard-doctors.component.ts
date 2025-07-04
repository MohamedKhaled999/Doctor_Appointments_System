import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardData } from '../../../../core/interfaces/AdminDashboard.interface';
import { DashboardService } from '../../../../core/services/Dashboard.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-doctors',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-doctors.component.html',
  styleUrl: './dashboard-doctors.component.css'
})
export class DashboardDoctorsComponent {
  @Input() data!: DashboardData;

  constructor(private dashboardService: DashboardService) { }

  protected approve(docId: number): void {
    console.log("Approving doctor with ID:", docId);
    this.dashboardService.approveDoctor(docId).subscribe({
      next: (response) => {
        console.log("Approval successful", response);
        this.data.unApprovedDoctor = this.data.unApprovedDoctor.filter(doc => doc.id !== docId);
      },
      error: (err) => {
        console.error("Approval failed", err);
      }
    });
  }
}
