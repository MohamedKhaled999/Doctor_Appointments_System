import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating',
  imports:[CommonModule],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {
  @Input() rating: number = 0;

  getStarBackground(): string {
    const percent = (this.rating / 5) * 100;
    return `linear-gradient(to right, #004085 0% ${percent}%, rgba(41, 40, 40, 0.4) ${percent}% 100%)`;
  }
  

  getFaceIcon(): string {
    if (this.rating <= 1) {
      return 'fa-regular fa-face-frown';
    } else if (this.rating <= 2.5) {
      return 'fa-regular fa-face-frown-open';
    } else if (this.rating <= 3) {
      return 'fa-regular fa-face-meh';
    } else if (this.rating < 4.5) {
      return 'fa-regular fa-face-smile';
    } else {
      return 'fa-regular fa-face-smile-beam';
    }
  }
}
