import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../../../core/services/account.service';
import { SocialauthService } from '../../../../core/services/socialauth.service';
import { ExternalProvider } from '../../../../core/models/external-provider.model';
import { LoginResponse } from '../../../../core/interfaces/login-response.mode';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
const customEmailPattern = /^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.com$/;
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ,RouterLink],
  templateUrl: './login.component.html',
  styleUrl:'./login.component.css'
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
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern(customEmailPattern) 
      ]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
    this.loadExternalProviders();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private loadExternalProviders(): void {
    this.socialAuthService.getExternalProviders().subscribe({
      next: (providers) => this.externalProviders = providers,
      error: (err) => this.handleError('Failed to load login options')
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email, password, rememberMe } = this.loginForm.value;

    this.accountService.login(email, password, rememberMe).subscribe({
      next: (response) => {
        this.storeAuthData(response);
        this.router.navigate(['/home']);
      },
      error: (error) => this.handleLoginError(error)
    });
  }

  private storeAuthData(response: LoginResponse): void {
    const storage = this.loginForm.value.rememberMe ? localStorage : sessionStorage;
    storage.setItem('authToken', response.token);
  }

  private handleLoginError(error: any): void {
    this.isLoading = false;
    this.validationErrors = [error.error?.message || 'Login failed. Please try again.'];
    
    if (error.status === 401 && error.error?.requiresConfirmation) {
      this.emailNotConfirmed = true;
    }
  }

  async externalLogin(provider: string): Promise<void> {
    try {
      await this.socialAuthService.externalLogin(provider);
    } catch (err) {
      this.handleError('External login failed');
    }
  }

  private handleError(message: string): void {
    this.isLoading = false;
    this.validationErrors = [message];
  }
}