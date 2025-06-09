import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, afterRender, inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Check platform first
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('userToken');
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
