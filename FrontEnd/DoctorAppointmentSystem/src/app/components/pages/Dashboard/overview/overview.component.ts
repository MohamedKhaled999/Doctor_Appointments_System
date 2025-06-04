import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCardComponent } from '../stats-card/stats-card.component';
import { DashboardData } from '../../../../core/interfaces/AdminDashboard.interface';

@Component({
  selector: 'app-overview',
  imports: [CommonModule,StatsCardComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent {
  @Input() data!: DashboardData;
}
