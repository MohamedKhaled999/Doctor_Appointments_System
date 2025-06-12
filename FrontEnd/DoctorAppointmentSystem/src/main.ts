/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { register as SwiperRegister } from 'swiper/element/bundle';
import { provideHttpClient } from '@angular/common/http';



SwiperRegister();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
