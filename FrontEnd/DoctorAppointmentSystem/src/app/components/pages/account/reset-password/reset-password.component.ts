import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../../core/services/account.service';
import { ResetPasswordVM } from '../../../../core/models/reset-password.model';
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
      this.email = params['email'];
      this.token = params['token'];
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value 
      ? null : { mismatch: true };
  }

  togglePasswordVisibility(field: 'new' | 'confirm') {
    this.showPassword[field] = !this.showPassword[field];
  }

  onSubmit() {
    if (this.resetForm.valid) {
      const resetData: ResetPasswordVM = {
        ...this.resetForm.value,
        email: this.email,
        token: this.token
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
        error: (err: { error?: string }) => {
          Swal.fire({
            title: 'Error!',
            text:  'Failed to reset password',
            icon: 'error'
          });
        }
      });
    }
  }
}