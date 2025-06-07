import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../../core/services/account.service';
import { ResetPassword } from '../../../../core/interfaces/reset-password';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  showPassword = {
    new: false,
    confirm: false
  };
  email: string = '';
  token: string = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.token = params['token'] || '';
      
      if (!this.email || !this.token) {
        Swal.fire({
          title: 'Invalid Link',
          text: 'The reset password link is invalid or expired',
          icon: 'error'
        }).then(() => {
          this.router.navigate(['/forgot-password']);
        });
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  togglePasswordVisibility(field: 'new' | 'confirm') {
    this.showPassword[field] = !this.showPassword[field];
  }

  onSubmit() {
    if (this.resetForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const resetData: ResetPassword = {
        email: this.email,
        token: this.token,
        newPassword: this.resetForm.value.newPassword
      };

      this.accountService.resetPassword(resetData).subscribe({
        next: () => {
          Swal.fire({
            title: 'Success!',
            text: 'Your password has been reset successfully',
            icon: 'success',
            confirmButtonText: 'Go to Login'
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (err) => {
          this.isSubmitting = false;
          Swal.fire({
            title: 'Error!',
            text: err.message || 'Failed to reset password',
            icon: 'error'
          });
        }
      });
    }
  }
}