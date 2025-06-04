import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'


@Component({
  selector: 'app-stats-card',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.css'
})
export class StatsCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() icon: string = '';
  @Input() color: string = '#3B82F6';
  @Input() change?: number;

  getIcon(): string {
    const iconMap: { [key: string]: string } = {
      'user-check': '👨‍⚕️',
      'users': '👥',
      'calendar': '📅',
      'dollar-sign': '💰',
      'star': '⭐',
      'trending-up': '📈'
    };
    return iconMap[this.icon] || '📊';
  }
}
