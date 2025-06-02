import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../../../core/services/account.service'
import { Governorate } from '../../../../core/enums/governorate.enum';
import { environment } from '../../../../core/environments/environment';
import { RecaptchaDirective } from '../../../../core/directives/recaptcha.directive';
import { ValidDate } from '../../../../core/validators/ValidDate';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-register',
  standalone: true,
  providers: [AccountService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaDirective,
    RouterLink
  ],
  
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  currentStep = 1;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  validationErrors: string[] = [];
  governorates = Object.values(Governorate);
  siteKey = environment.recaptcha.siteKey;

  recaptchaLanguage = 'en'; 

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.registerForm = this.fb.group(
      {
    
        firstName: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-Z0-9](?:[a-zA-Z0-9_ -]*[a-zA-Z0-9])?$/)
          ]
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-Z0-9](?:[a-zA-Z0-9_ -]*[a-zA-Z0-9])?$/)
          ]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
          ]
        ],
        confirmPassword: ['', Validators.required],
    
      
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/)
          ]
        ]
        
      ,
        phoneNumber: [
          '',
          [
            Validators.required,
            Validators.pattern(/^0\d{10}$/)
          ]
        ],
        governorate: ['', Validators.required],
        birthDate: ['', [Validators.required, ValidDate()]],
        recaptcha: [null, Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  } 
  ngOnInit(): void {
    this.loadRecaptchaScript();
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  nextStep(): void {
    const step1Controls = [
      'firstName',
      'lastName',
      'password',
      'confirmPassword',
    ];
    step1Controls.forEach((control) => {
      this.registerForm.get(control)?.markAsTouched();
    });

    if (
      this.registerForm.get('password')?.value !==
      this.registerForm.get('confirmPassword')?.value
    ) {
      this.registerForm.get('confirmPassword')?.setErrors({ mismatch: true });
      return;
    }

    if (
      this.registerForm.get('firstName')?.valid &&
      this.registerForm.get('lastName')?.valid &&
      this.registerForm.get('password')?.valid &&
      this.registerForm.get('confirmPassword')?.valid
    ) {
      this.currentStep = 2;
    }
  }

  prevStep(): void {
    this.currentStep = 1;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.validationErrors = [];
    // const registerData = {
    const formValue = this.registerForm.value;
    // const registerData = {
    //   firstName: formValue.firstName,
    //   lastName: formValue.lastName,
    //   email: formValue.email,
    //   password: formValue.password,

    //   phoneNumber: formValue.phoneNumber,
    //   governorate: formValue.governorate,
    //   birthDate: formValue.birthDate,

    // };
    const registerData = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      password: formValue.password,
      confirmPassword: formValue.confirmPassword,
      phoneNumber: formValue.phoneNumber,
      governorate: formValue.governorate,
      birthDate: formValue.birthDate,
      recaptchaToken: formValue.recaptcha,
    };
    /*
      firstName: string;
    lastName: string;
    email: string;
    governorate: Governorate; // Assuming governorate is represented as a number (e.g., an ID)
    password: string;
    phoneNumber?: string; // Optional field for phone number
    address?: string; // Optional field for address
    dateOfBirth?: Date; 
    */

    this.accountService.register(registerData).subscribe({
      next: () => {
        console.log('Registration successful');
        this.router.navigate(['/NeedToConfirm']);
        console.log('Registration successful');
      },
      error: (error:any) => {
        this.isLoading = false;
        if (Array.isArray(error)) {
          this.validationErrors = error;
        } else {
          this.validationErrors = [
            error || 'Registration failed. Please try again',
          ];
        }
      },
    });
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  handleRecaptchaResponse(token: string): void {
    this.registerForm.get('recaptcha')?.setValue(token);
  }

  private loadRecaptchaScript(): void {
    if (isPlatformBrowser(this.platformId)) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}&hl=${this.recaptchaLanguage}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }
 
  
}