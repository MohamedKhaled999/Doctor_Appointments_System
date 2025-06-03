import { TestSwiperComponent } from './components/shared/test-swiper/test-swiper.component';
import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'test',
    component: TestSwiperComponent,
    title: 'Test Swiper',
  },
  {
    path: 'patient-profile',
    loadComponent: () => import('./components/pages/patient-profile/patient-profile.component').then(m => m.PatientProfileComponent),
  }

];
