import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardData } from '../../../../core/interfaces/AdminDashboard.interface';

@Component({
  selector: 'app-dashboard-doctors',
  imports: [CommonModule],
  templateUrl: './dashboard-doctors.component.html',
  styleUrl: './dashboard-doctors.component.css'
})
export class DashboardDoctorsComponent {
    @Input() data!: DashboardData;

    protected Approve(docId:number) {
      //do something
      return
    } 
}
