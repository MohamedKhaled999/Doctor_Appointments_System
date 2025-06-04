import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../../../core/interfaces/AdminDashboard.interface';

@Component({
  selector: 'app-side-nav',
  imports: [CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {
  @Input() activeSection: string = 'overview';
  @Output() sectionChange = new EventEmitter<string>();

  menuItems: MenuItem[] = [
    { id: 'overview', label: 'Overview', icon: 'fa-activity' },
    { id: 'appointments', label: 'Appointments', icon: 'fa-calendar' },
    { id: 'doctors', label: 'Doctors', icon: 'fa-user-check' },
    { id: 'patients', label: 'Patients', icon: 'fa-users' },
    { id: 'revenue', label: 'Revenue', icon: 'fa-dollar-sign' },
    { id: 'analytics', label: 'Analytics', icon: 'fa-trending-up' }
  ];

  onMenuClick(sectionId: string): void {
    this.sectionChange.emit(sectionId);
  }
}
