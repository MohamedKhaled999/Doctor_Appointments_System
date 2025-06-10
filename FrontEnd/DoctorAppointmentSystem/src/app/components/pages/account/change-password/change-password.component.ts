import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../../core/services/account.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  showPassword = {
    old: false,
    new: false,
    confirm: false
  };
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {
    this.changePasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      oldPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value 
      ? null : { mismatch: true };
  }

  togglePasswordVisibility(field: 'old' | 'new' | 'confirm') {
    this.showPassword[field] = !this.showPassword[field];
  }

  onSubmit() {
    if (this.changePasswordForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formData = {
        email: this.changePasswordForm.value.email,
        oldPassword: this.changePasswordForm.value.oldPassword,
        newPassword: this.changePasswordForm.value.newPassword
      };

      this.accountService.changePassword(formData).subscribe({
        next: () => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon: 'success',
            title: 'Password changed successfully!'
          });
          this.changePasswordForm.reset();
          this.isSubmitting = false;
        },
        error: (httpError) => {
          this.isSubmitting = false;
          
         
          const errorObj = httpError.error; 
          const errorMessage = errorObj?.ErrorMessage || 'Failed to change password';
      
          console.error('Password change error:', httpError);
      
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon: 'error',
            title: errorMessage
          });
        }
      });
    }
  }
}