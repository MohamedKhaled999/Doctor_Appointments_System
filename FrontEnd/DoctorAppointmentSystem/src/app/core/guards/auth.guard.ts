import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  //inject router
  const router = inject(Router);
   const _PLATFORM_ID= inject(PLATFORM_ID);


  // Check if the user is logged in by verifying the presence of a token in localStorage
  const token = localStorage.getItem('userToken');

  
 if (isPlatformBrowser(_PLATFORM_ID)) {
          if (localStorage.getItem('userToken')) {
            return true;
          }
 }else{
  // If the platform is not a browser, we cannot access localStorage
  // Redirect to the login page or handle accordingly
  router.navigate(['/login']);
           return false;
 }


  return true;
};
