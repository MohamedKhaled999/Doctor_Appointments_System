import { Component, Input, OnChanges ,SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartConfiguration } from 'chart.js';
import { DashboardData } from '../../../../core/interfaces/AdminDashboard.interface';
import { Console } from 'node:console';

@Component({
  selector: 'app-dashboard-appoiments',
  imports: [CommonModule,BaseChartDirective],
  templateUrl: './dashboard-appoiments.component.html',
  styleUrl: './dashboard-appoiments.component.css'
})
export class DashboardAppoimentsComponent {
    @Input() data: DashboardData | null = null;
    
      ngOnChanges(changes: SimpleChanges) {
        if (changes['data']) {
          this.updateChartData();
        }
      }
    
      private updateChartData() {
      this.barChartData = {
        labels: this.data?.appointmentStatus.map(x => x.status) || [],
        datasets: [
          { data: this.data?.appointmentStatus.map(x => x.count) || [],
            label: 'Appointments' }
        ]
      };        
      }
      // Bar
      public barChartLegend = true;
      public barChartPlugins = [];
    
      public barChartData: ChartConfiguration<'bar'>['data'] = {
        labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
        datasets: [
          { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
          { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
        ]
      };
    
      public barChartOptions: ChartConfiguration<'bar'>['options'] = {
        responsive: true,
        maintainAspectRatio: false,
      };
}
