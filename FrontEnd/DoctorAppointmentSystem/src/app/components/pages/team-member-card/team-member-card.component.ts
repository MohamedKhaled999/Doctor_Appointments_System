import { Component, Input } from '@angular/core';
import { TeamMemberCard } from '../../../core/interfaces/TeamMemberCard.interface';

@Component({
  selector: 'app-team-member-card',
  imports: [],
  templateUrl: './team-member-card.component.html',
  styleUrl: './team-member-card.component.css'
})
export class TeamMemberCardComponent {
  @Input() member!: TeamMemberCard;
  @Input() isEven!: boolean;
}
