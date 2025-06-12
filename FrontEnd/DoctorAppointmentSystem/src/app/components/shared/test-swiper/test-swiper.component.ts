import { UserManagementData } from './../../../core/interfaces/user-management-data';
import { FacebookLoginProvider, GoogleLoginProvider, GoogleSigninButtonDirective, MicrosoftLoginProvider, SocialAuthService, SocialLoginModule, SocialUser } from '@abacritt/angularx-social-login';
import { Component ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { log } from 'node:console';
import { DataManagementService } from '../../../core/services/data-management.service';

declare const google: any;
import { ReservationCardComponent } from "../reservation-card/reservation-card.component";

@Component({
  selector: 'app-test-swiper',
  imports: [SocialLoginModule, ReservationCardComponent],
  templateUrl: './test-swiper.component.html',
  styleUrl: './test-swiper.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true
})
export class TestSwiperComponent {

  // Sample data for the swiper
  reservations = [
    
        {
          ResID: 101,
          Day: 2, // Monday (assuming 0 is Sunday)
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 102,
          Day: 3,
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 103,
          Day: 4, // Wednesday
          Time: '09:00|10:00 AM',
          IsAvailable: false
        },
          {
          ResID: 101,
          Day: 2, // Monday (assuming 0 is Sunday)
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 102,
          Day: 3,
          Time: '09:00|10:00 AM',
          IsAvailable: true
        },
        {
          ResID: 103,
          Day: 4, // Wednesday
          Time: '09:00|10:00 AM',
          IsAvailable: false
        }
      
  ];




  isPatient:boolean =false;

   ngOnInit(): void {


    this.userData.UserRole() == "Doctor" ? this.isPatient = false : this.isPatient = true;
    
    this.authService.authState.subscribe((user: SocialUser) => {
    if (user) {
        console.log('inside:subscribe:: User is signed in');
        console.log('User Info:', user.provider);
        console.log( user.provider,'ID Token:', user.idToken);
        console.log('idToken vs Authtoken:', user.idToken == user.authToken);
        console.log('User Info:', user);
      }
      // Handle user sign-in state here
      else{
        console.log('User is not signed in');
      }
    });
  }

 
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
  signInWithMS() {
 this.authService.signIn(MicrosoftLoginProvider.PROVIDER_ID);
}


   handleGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: '129132539282-46cp2683kfig5g8g6pjmrs2h9o1gsdn6.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this)
    });
      google.accounts.id.renderButton(
      document.getElementById("custom-google-signin-button"),
      { theme: "outline", size: "medium", text: "signin_with", logo_alignment: "left"} 
      
    );
   
  }

  handleCredentialResponse(response: any) {
    // This function is called when the user successfully signs in with Google
    // You can access the ID token and other user information here
    console.log('Google Sign-In Response:');
    console.log(response);
    
    const idToken = response.credential;
    console.log('Google ID Token:', idToken);
    // 👉 Send this token to your backend for verification
  }

  // error massage toaster fun



  constructor(private toster: ToastrService, private authService: SocialAuthService ,
     private userData:DataManagementService) {
    // You can initialize any properties or services here if needed

  //  toster.error("Something Error", "Please try again !")
    
  }


  // Toaster exampels
  // showSuccess() {
  //   this.toster.success('This is a success message!', 'Success');
  // }
  // showError() {
  //   this.toster.error('This is an error message!', 'Error');
  // }
  // showInfo() {
  //   this.toster.info('This is an info message!', 'Info');
  // }
  // showWarning() {
  //   this.toster.warning('This is a warning message!', 'Warning');
  // }
  // showCustom() {
  //   this.toster.show('This is a custom message!', 'Custom', {
  //     timeOut: 3000,
  //     progressBar: true,
  //     closeButton: true,
  //     positionClass: 'toast-bottom-right'
  //   });
  // }
  // showToast() {
  //   this.toster.show('This is a toast message!', 'Toast', {
  //     timeOut: 5000,
  //     progressBar: true,
  //     closeButton: true,
  //     positionClass: 'toast-top-center'
  //   });
  // }



 
}
