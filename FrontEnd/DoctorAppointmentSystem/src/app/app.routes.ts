import { Routes } from '@angular/router';
import { TestSwiperComponent } from './components/shared/test-swiper/test-swiper.component';
import { RegisterComponent } from './components/pages/account/register/register.component';
import { LoginComponent } from './components/pages/account/login/login.component';
import { NeedToConfirmComponent } from './components/pages/account/need-to-confirm/need-to-confirm.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ForgetPasswordComponent } from './components/pages/account/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/pages/account/reset-password/reset-password.component';
import { ChangePasswordComponent } from './components/pages/account/change-password/change-password.component';
import { DoctorRegisterComponent } from './components/pages/account/doctor-register/doctor-register.component';
import { ConfirmEmailComponent } from './components/pages/account/confirm-email/confirm-email.component';

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
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home - Doctor Appointments'
  },
  { 
    path: 'reset-password', 
    component: ResetPasswordComponent 
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent
  
  },
  { 
    path: 'doctor-register', 
    component: DoctorRegisterComponent 
  },
  { 
    path: 'ConfirmEmail', 
    component: ConfirmEmailComponent

  }
];
