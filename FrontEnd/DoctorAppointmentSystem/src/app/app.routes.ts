import { TestSwiperComponent } from './components/shared/test-swiper/test-swiper.component';
import { RegisterComponent } from './components/pages/account/register/register.component';
import { LoginComponent } from './components/pages/account/login/login.component';
import { NeedToConfirmComponent } from './components/pages/account/need-to-confirm/need-to-confirm.component';
import { Routes } from '@angular/router';
import { ForgetPasswordComponent } from './components/pages/account/forget-password/forget-password.component';
export const routes: Routes = [
  {
    path: 'test',
    component: TestSwiperComponent,
    title: 'Test Swiper',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register Account'
  },
  { 
    path: 'login', 
    component: LoginComponent,
    title: 'Sign In - Doctor Appointments'
  },
  {
    path: 'forgot-password',
    component: ForgetPasswordComponent,
    title: 'Password Recovery - Doctor Appointments'
  },
  {
    path: 'need-to-confirm',
    component: NeedToConfirmComponent, 
    title: 'Need to Confirm - Doctor Appointments'
  }
];