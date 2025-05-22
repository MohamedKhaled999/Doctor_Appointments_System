import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../../core/services/account.service';
import { ForgetPasswordVM } from '../../../../core/models/forget-password.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  forgetPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.com$/)]]
    });
  }

  onSubmit() {
    if (this.forgetPasswordForm.valid) {
      const forgetPasswordData: ForgetPasswordVM = this.forgetPasswordForm.value;
      
      this.accountService.forgotPassword(forgetPasswordData).subscribe({
        next: () => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon: 'success',
            title: 'The Email Exists!'
          });
          this.router.navigate(['/login']);
        },
        error: (err: { error?: string }) => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon: 'error',
            title:  'The Email Doesnot Exist'
          });
        
        }
      });
    }
  }
}