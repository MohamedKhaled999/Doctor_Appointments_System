import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {
  duration = 3;
  counter = this.duration;
  private countdownInterval: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      if (this.counter > 0) {
        this.counter--;
      } else {
        clearInterval(this.countdownInterval);
        this.router.navigate(['/dashboard']); 
      }
    }, 1000);
  }

  getProgressWidth(): string {
    return `${(this.counter / this.duration) * 100}%`;
  }
}