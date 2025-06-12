import { Component, Input, OnChanges ,SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartConfiguration } from 'chart.js';
import { StatsCardComponent } from '../stats-card/stats-card.component';
import { DashboardData } from '../../../../core/interfaces/AdminDashboard.interface';


@Component({
  selector: 'app-overview',
  imports: [CommonModule,StatsCardComponent,NgChartsModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnChanges {
  @Input() data: DashboardData | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.updateChartData();
    }
  }

  private updateChartData() {
    this.pieChartLabels = this.data!.specialtyDistribution.map(x => x.name);
    this.pieChartDatasets = [{
      data: this.data!.specialtyDistribution.map(x => x.value),
    }];
    this.lineChartData = {
    labels: this.data?.monthlyStats.map(x => x.month) || [], // Use months from data
    datasets: [
      {
        data: this.data?.monthlyStats.map(x => x.revenue) || [],
        label: 'Revenue',
        fill: true,
        tension: 0.5,
        borderColor: '#3B82F6', 
        backgroundColor: 'rgba(59, 130, 246, 0.1)' // Light blue
      }
    ]
  };
  this.barChartData = {
    labels: this.data?.monthlyStats.map(x => x.month) || [],
    datasets: [
      { data: this.data?.monthlyStats.map(x => x.appointments) || [],
        label: 'Appointments' },
      { data: this.data?.monthlyStats.map(x => x.patients) || [],
        label: 'Patients'}
    ]
  };
  }
   // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  public pieChartDatasets = [ {
    data: [ 300, 500, 100 ]
  } ];
  public pieChartLegend = true;
  public pieChartPlugins = [];

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
  };

  // Line
  public lineChartData: ChartConfiguration<'line'>['data'] = {
  labels: this.data?.monthlyStats.map(x => x.month) || [], // Use months from data
  datasets: [
    {
        data: this.data?.monthlyStats.map(x => x.revenue) || [],
        label: 'Revenue',
        fill: true,
        tension: 0.5,
        borderColor: '#3B82F6', 
        backgroundColor: 'rgba(59, 130, 246, 0.1)' // Light blue
    }
  ]
};
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = true;


}
