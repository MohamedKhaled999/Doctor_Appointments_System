import { FacebookLoginProvider, MicrosoftLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../../core/services/account.service';
import { Router } from '@angular/router';  // Import Router for navigation
import Swal from 'sweetalert2';
import { AuthResponse } from '../../../core/interfaces/auth-response';
import { DataManagementService } from '../../../core/services/data-management.service';
import { log } from 'console';
declare const google: any;

@Component({
  selector: 'app-extrenal-login',
  templateUrl: './extrenal-login.component.html',
  styleUrls: ['./extrenal-login.component.css']  // Corrected the styleUrl to styleUrls
})
export class ExtrenalLoginComponent {

   constructor(
     private toastr: ToastrService,
     private authService: SocialAuthService,
     private externalloginService: AccountService,
     private router: Router, // Inject Router to handle navigation
     private dataService:DataManagementService
   ) {}

   ngOnInit(): void {
      this.authService.authState.subscribe((user: SocialUser) => {
         if (user) {
            if (!user.idToken) {
               user.idToken = user.authToken; // Fallback for older versions of the library
            }
            
            // Store the token securely in localStorage or sessionStorage
            // localStorage.setItem('userToken', user.idToken); // Or use sessionStorage if needed

            this.externalloginService.externalLogin({
               token: user.idToken,
               provider: user.provider
            }).subscribe(
               {
               next: (response) => {
                  console.log('External login successful:', response);
                  this.storeAuthData(response)
                  // Handle successful login, e.g., navigate to a different page or show a success message
               },
               error: (httpError) => {
                
            
                  const errorObj = httpError.error;
                  const errorMessage = errorObj?.ErrorMessage || "Login failed. Please try again.";
            
                  Swal.fire({
                    icon: 'warning',
                    title: 'Login Error',
                    text: errorMessage,
                    confirmButtonText: 'OK'
                  });
                }
            });

            console.log('Google ID Token:', user.idToken);
            console.log('User Info:', user);
         } else {
            console.log('User is not signed in');
         }
      });
   }

   signInWithFB(): void {
      this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
   }

   signInWithMS(): void {
      this.authService.signIn(MicrosoftLoginProvider.PROVIDER_ID);
   }

   handleGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: '129132539282-46cp2683kfig5g8g6pjmrs2h9o1gsdn6.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this)
    });

      google.accounts.id.renderButton(
         document.getElementById("custom-google-signin-button"),
         { 
            theme: "outline", 
            size: "large", 
            text: "signin_with", 
            logo_alignment: "login",
            locale: "en" 
         }
      );
   }

   handleCredentialResponse(response: any): void {
      console.log(response);

      const idToken = response.credential;
      console.log('Google ID Token:', idToken);

      // Store the token in localStorage or sessionStorage
      localStorage.setItem('userToken', idToken); // Or use sessionStorage

      this.externalloginService.externalLogin({
         token: idToken,
         provider: "google"
      }).subscribe({
         next: (response) => {
            console.log('External login successful:', response);
            this.storeAuthData(response)
            // Handle successful login, e.g., navigate to a different page or show a success message
         },
         error: (httpError) => {
        
            const errorObj = httpError.error;
            const errorMessage = errorObj?.ErrorMessage || "Login failed. Please try again.";
      
            Swal.fire({
              icon: 'warning',
              title: 'Login Error',
              text: errorMessage,
              confirmButtonText: 'OK'
            });
          }
      });
   }

     private storeAuthData(response: AuthResponse): void {
      
    localStorage.setItem('userToken', response.token);
    localStorage.setItem('rememberMe','false');
    localStorage.setItem('userRole', response.role);
    localStorage.setItem('userName', response.displayName);
    this.dataService.isAuthenticated.set(true);
    this.dataService.UserName.set(response.displayName);
    this.dataService.UserRole.set(response.role);
    console.log(response);
    this.router.navigate(['/home']);
  }

}
