

import { provideAnimations } from '@angular/platform-browser/animations';

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';



import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { headerInterceptor } from './core/interceptors/header.interceptor';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes), provideClientHydration(withEventReplay()),
  provideHttpClient(withFetch(), withInterceptors([headerInterceptor])),

  provideAnimations(),
  provideToastr({ timeOut: 1000, positionClass: 'toast-top-right' }),


  ]
}
