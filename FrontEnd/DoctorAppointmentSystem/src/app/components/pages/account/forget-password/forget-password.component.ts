import { Component } from '@angular/core';

import { AccountService } from '../../../../core/services/account.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({

  selector: 'app-forget-password',
  standalone: true ,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  forgetPasswordForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }
  

  // onSubmit() {
  //   if (this.forgetPasswordForm.valid && !this.isSubmitting) {
  //     this.isSubmitting = true;
      
  //     const forgetPasswordData = {
  //       email: this.forgetPasswordForm.value.email,
  //       firstName: this.forgetPasswordForm.value.firstName,
  //       lastName: this.forgetPasswordForm.value.lastName
  //     };

  //     this.accountService.forgotPassword(forgetPasswordData).subscribe({
  //       next: () => {
  //         Swal.fire({
  //           title: 'Success!',
  //           text: 'Password reset link has been sent to your email',
  //           //email exist
  //           icon: 'success',
  //           confirmButtonText: 'OK'
  //         }).then(() => {
  //           this.router.navigate(['/login']);
  //         });
  //       },
  //       error: (err) => {
  //         this.isSubmitting = false;
  //         let errorMessage = 'Failed to process your request';
          
  //         if (err.status === 404) {
  //           errorMessage = 'User not found with this email';
  //         } else if (err.error?.message) {
  //           errorMessage = err.error.message;
  //         }

  //         Swal.fire({
  //           title: 'Error',
  //           text: errorMessage,
  //           icon: 'error',
  //           confirmButtonText: 'OK'
  //         });
  //       }
  //     });
  //   }
  // }
  // onSubmit() {
  //   // Only submit if the form is valid and we're not already submitting
  //   if (this.forgetPasswordForm.valid && !this.isSubmitting) {
  //     this.isSubmitting = true;  // Prevent multiple submissions
      
  //     const forgetPasswordData = {
  //       email: this.forgetPasswordForm.value.email,
  //       firstName: this.forgetPasswordForm.value.firstName,
  //       lastName: this.forgetPasswordForm.value.lastName
  //     };
  
    //   // Send the request to the server
    //   this.accountService.forgotPassword(forgetPasswordData).subscribe({
    //     next: () => {
    //       Swal.fire({
    //         title: 'Success!',
    //         text: 'Password reset link has been sent to your email.',
    //         icon: 'success',
    //         confirmButtonText: 'OK'
    //       }).then(() => {
    //         this.router.navigate(['/login']);  // Redirect to the login page after success
    //       });
    //     },
    //     error: (err) => {
    //       this.isSubmitting = false;  // Reset the submitting flag
          
    //       // Custom error handling
    //       let errorMessage = 'Failed to process your request';
          
    //       if (err.status === 404) {
    //         errorMessage = 'User not found with this email.';
    //       } else if (err.error?.message) {
    //         errorMessage = err.error.message;
    //       }
          
    //       Swal.fire({
    //         title: 'Error',
    //         text: errorMessage,
    //         icon: 'error',
    //         confirmButtonText: 'OK'
    //       });
    //     }
    //   });
    // } else {
    //   // If form is invalid, show a validation error
    //   Swal.fire({
    //     title: 'Error',
    //     text: 'Please fill in all required fields.',
    //     icon: 'error',
    //     confirmButtonText: 'OK'
      //   });
      onSubmit() {
        if (this.forgetPasswordForm.valid && !this.isSubmitting) {
          this.isSubmitting = true;
          const forgetPasswordData = {
            email: this.forgetPasswordForm.value.email,
            firstName: this.forgetPasswordForm.value.firstName,
            lastName: this.forgetPasswordForm.value.lastName
          };
      
          this.accountService.forgetPassword(forgetPasswordData).subscribe({
            next: (response) => {
              if (response && response.token) {
           
                console.log('Token received:', response.token);
            
                Swal.fire({
                  title: 'Success!',
                  text: 'Password reset link has been sent to your email.',
                  icon: 'success',
                  confirmButtonText: 'OK'
                }).then(() => {
                  this.router.navigate(['/login']);
                });
              } else {
                // If there's no token, just show the success message
                Swal.fire({
                  title: 'Success!',
                  text: 'Password reset link has been sent to your email.',
                  icon: 'success',
                  confirmButtonText: 'OK'
                }).then(() => {
                  this.router.navigate(['/login']);
                });
              }
            },
            error: (err) => {
              this.isSubmitting = false;
              let errorMessage = 'Failed to process your request';
      
              if (err.status === 404) {
                errorMessage = 'User not found with this email.';
              } else if (err.error?.message) {
                errorMessage = err.error.message;
              }
      
              Swal.fire({
                title: 'Error',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          });
        }
      }
      
    }
  
  
