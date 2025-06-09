

import { provideAnimations } from '@angular/platform-browser/animations';

import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';



import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { headerInterceptor } from './core/interceptors/header.interceptor';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';
import { MatNativeDateModule } from '@angular/material/core';
import { FacebookLoginProvider, GoogleLoginProvider, MicrosoftLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([headerInterceptor,loadingInterceptor])),
  

  provideAnimations(),
  provideToastr({ timeOut: 1000, positionClass: 'toast-top-right' }),
  importProvidersFrom(MatNativeDateModule),

    //  importProvidersFrom(),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('129132539282-46cp2683kfig5g8g6pjmrs2h9o1gsdn6.apps.googleusercontent.com'),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('9909134219180808'),
          }
        ,
          {
            id: MicrosoftLoginProvider.PROVIDER_ID,
            provider: new MicrosoftLoginProvider('83feb7fe-21df-499f-9cb5-b61a050e24f1'),
          }
        ],
        onError: (err:any) => console.error('Social Auth Error', err),
      } as SocialAuthServiceConfig
    }
  ]
}
// provideHttpClient(withFetch(), withInterceptors([ErrorInterceptor])),