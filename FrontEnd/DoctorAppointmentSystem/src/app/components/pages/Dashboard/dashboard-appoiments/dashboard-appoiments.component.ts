import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardData } from '../../../../core/interfaces/AdminDashboard.interface';

@Component({
  selector: 'app-dashboard-appoiments',
  imports: [CommonModule],
  templateUrl: './dashboard-appoiments.component.html',
  styleUrl: './dashboard-appoiments.component.css'
})
export class DashboardAppoimentsComponent {
    @Input() data!: DashboardData;
}
