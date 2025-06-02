import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {
  duration = 3;
  counter = this.duration;
  private countdownInterval: any;

  constructor(private router: Router,private activatedRoute: ActivatedRoute ) {}

  ngOnInit(): void {
    this .activatedRoute.params.subscribe(params => {
      const token = params['token'];
      const email = params['email'];


      if (token) {
        // Here you would typically call a service to confirm the email with the token
        console.log('Email confirmation token:', token);
        // Simulate email confirmation success
        // this.accountService.confirmEmail(token).subscribe({
        //   next: () => {
        //     console.log('Email confirmed successfully');
        //   },
        //   error: (error) => {
        //     console.error('Email confirmation failed:', error);
        //   }
        // });
      } else {
        console.error('No token provided for email confirmation');
      }
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