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
            // If the user is not logged in, redirect to the login page
            // and return false to prevent access to the requested route
  router.navigate(['/login']);
           return false;
 }


  return true;
};
