import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../../core/services/account.service';
import { SocialauthService } from '../../../../core/services/socialauth.service';
import { ExternalProvider } from '../../../../core/models/external-provider.model';
import { LoginResponse } from '../../../../core/interfaces/login-response.mode';
import { log } from 'console';
import { ExtrenalLoginComponent } from '../../../shared/extrenal-login/extrenal-login.component';
import { AuthResponse } from '../../../../core/interfaces/auth-response';
import Swal from 'sweetalert2';
import { UserManagementData } from '../../../../core/interfaces/user-management-data';
import { DataManagementService } from '../../../../core/services/data-management.service';

const customEmailPattern = /^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.com$/;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,ExtrenalLoginComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  validationErrors: string[] = [];
  externalProviders: ExternalProvider[] = [];
  emailNotConfirmed = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private socialAuthService: SocialauthService,
    private dataService:DataManagementService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(customEmailPattern)]],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    // this.loadExternalProviders();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // private loadExternalProviders(): void {
  //   this.socialAuthService.getExternalProviders().subscribe({
  //     next: (providers) => this.externalProviders = providers,
  //     error: () => this.handleError('Failed to load login options')
  //   });
  // }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email, password, rememberMe } = this.loginForm.value;

      console.log('Login attempt:', { email, password, rememberMe });
    this.accountService.login(email, password).subscribe({
      next: (response) => {
        this.storeAuthData(response, rememberMe);
        console.log('Login successful:', response);
        
        this.router.navigate(['/home']);
      },
      error: (error) =>{
      
        if (error.status === 401 ) {
          Swal.fire({
            icon: 'warning',
            title: 'Email Not Confirmed',
            text: 'Please confirm your email address before logging in.',
            confirmButtonText: 'OK'
          });
        } else {
          this.handleLoginError(error);
        }
      }    });
  }

  private storeAuthData(response: AuthResponse, remember: boolean): void {
 
    localStorage.setItem('userToken', response.token);
    localStorage.setItem('rememberMe', remember.toString());
    localStorage.setItem('userRole', response.role);
    localStorage.setItem('userName', response.displayName);
    this.dataService.isAuthenticated.set(true);
    this. dataService.UserName.set(response.displayName);
    this.dataService.UserRole.set(response.role);




  }

  private handleLoginError(error: any): void {
    this.isLoading = false;
    this.validationErrors = [error.error?.message || 'Login failed. Please try again.'];

    if (error.status === 401 && error.error?.requiresConfirmation) {
      this.emailNotConfirmed = true;
    }
  }

  // async externalLogin(provider: string): Promise<void> {
  //   try {
  //     await this.socialAuthService.externalLogin(provider);
  //   } catch {
  //     this.handleError('External login failed');
  //   }
  // }

  private handleError(message: string): void {
    this.isLoading = false;
    this.validationErrors = [message];
  }
}