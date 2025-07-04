import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../../../core/interfaces/AdminDashboard.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  imports: [CommonModule ,RouterModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {
  @Input() activeSection: string = 'overview';
  @Output() sectionChange = new EventEmitter<string>();
  @Input() collapsed: boolean = false;

  @Output() toggleCollapse = new EventEmitter<void>(); 

  menuItems: MenuItem[] = [
    { id: 'overview', label: 'Overview', icon: 'fa-activity' },
    { id: 'appointments', label: 'Appointments', icon: 'fa-calendar' },
    { id: 'doctors', label: 'Doctors', icon: 'fa-user-check' },
    { id: 'speciality', label: 'speciality', icon: 'fa-user-check' }
    // { id: 'patients', label: 'Patients', icon: 'fa-users' },
    // { id: 'revenue', label: 'Revenue', icon: 'fa-dollar-sign' },
    // { id: 'analytics', label: 'Analytics', icon: 'fa-trending-up' }
  ];

  onMenuClick(sectionId: string): void {
    this.sectionChange.emit(sectionId);
  }
  onToggleCollapse() {
    this.toggleCollapse.emit();
  }
}
