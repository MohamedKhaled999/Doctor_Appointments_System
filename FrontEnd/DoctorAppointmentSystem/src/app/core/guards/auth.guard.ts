import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, afterRender, inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Check platform first
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('userToken');
   afterNextRender(()=>{
  console.log("auth guard is running");
  console.log("Token:", token);
  
})
afterRender(()=>{
  console.log("auth guard is running after render");
  console.log("Token:", token);

})

    if (token) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  }

  // If not running in browser, block access
  return false;
};
