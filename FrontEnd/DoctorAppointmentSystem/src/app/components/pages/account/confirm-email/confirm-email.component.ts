import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../../core/services/account.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-confirm-email',
  imports:[CommonModule],
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {
  duration = 5; 
  counter = this.duration;
  private countdownInterval: any;
  isConfirmed = false;
  isLoading = true;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const email = params['email'];

      if (token && email) {
        this.confirmEmail(email, token);
      } else {
        this.isLoading = false;
        Swal.fire({
          title: 'Error',
          text: 'Invalid confirmation link',
          icon: 'error'
        }).then(() => {
          this.router.navigate(['/register']);
        });
      }
    });
  }

  confirmEmail(email: string, token: string): void {
    this.accountService.confirmEmail({ email, token }).subscribe({
      next: () => {
        this.isConfirmed = true;
        this.isLoading = false;
        this.startCountdown();
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Error',
          text: err.message || 'Email confirmation failed',
          icon: 'error'
        }).then(() => {
          this.router.navigate(['/register']);
        });
      }
    });
  }

  startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      if (this.counter > 0) {
        this.counter--;
      } else {
        clearInterval(this.countdownInterval);
        this.router.navigate(['/login']); 
      }
    }, 1000);
  }

  getProgressWidth(): string {
    return `${(this.counter / this.duration) * 100}%`;
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}