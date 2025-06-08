import { ExtrenalLoginComponent } from './components/shared/extrenal-login/extrenal-login.component';
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
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './components/pages/admin-dashboard/admin-dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { profile } from 'console';
import { PatientProfileComponent } from './components/pages/patient-profile/patient-profile.component';
import { DoctorEditComponent } from './components/pages/doctor-edit/doctor-edit.component';

// export const routes: Routes = [
//   {
//     path: 'test',
//     component: TestSwiperComponent,
//     title: 'Test Swiper',
//   },
//   {
//     path: 'patient-profile',
//     loadComponent: () => import('./components/pages/patient-profile/patient-profile.component').then(m => m.PatientProfileComponent),
//   },
//   {
//     path: 'doctor-profile/:id',
//     loadComponent: () => import('./components/pages/doctor-profile/doctor-profile.component').then(m => m.DoctorProfileComponent),
//   },
//   {
//     path: 'doctor-edit',
//     loadComponent: () => import('./components/pages/doctor-edit/doctor-edit.component').then(m => m.DoctorEditComponent),
//   },
//   {
//     path: 'register',
//     component: RegisterComponent,
//     title: 'Register Account'
//   },
//   { 
//     path: 'login', 
//     component: LoginComponent,
//     title: 'Sign In - Doctor Appointments'
//   },
//   {
//     path: 'forgot-password',
//     component: ForgetPasswordComponent,
//     title: 'Password Recovery - Doctor Appointments'
//   },
//   {
//     path: 'need-to-confirm',
//     component: NeedToConfirmComponent, 
//     title: 'Need to Confirm - Doctor Appointments'
//   },
//   {
//     path: 'home',
//     component: HomeComponent,
//     title: 'Home - Doctor Appointments'
//   },
//   { 
//     path: 'reset-password', 
//     component: ResetPasswordComponent 
//   },
//   {
//     path: 'change-password',
//     component: ChangePasswordComponent

//   },
//   { 
//     path: 'doctor-register', 
//     component: DoctorRegisterComponent 
//   },
//   { 
//     path: 'ConfirmEmail', 
//     component: ConfirmEmailComponent

//   }
// ];


export const routes: Routes = [
  // blank
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: HomeComponent,
        title: 'Home - Doctor Appointments'
      }
      ,
      {
        path: 'profile',
        // canActivate: [authGuard],
        children: [
          {
            path: '',
            redirectTo: 'not-found',
            pathMatch: 'full'
          },
          {
            path: 'patient',
            loadComponent: () => import('./components/pages/patient-profile/patient-profile.component').then(m => m.PatientProfileComponent),
          },
          {
            path: 'doctor',
            loadComponent: () => import('./components/pages/doctor-profile/doctor-profile.component').then(m => m.DoctorProfileComponent)
          },
          {
            path: 'doctor/edit',
            loadComponent: () => import('./components/pages/doctor-edit/doctor-edit.component').then(m => m.DoctorEditComponent)
          },
          {
            path: 'doctor/:id',
            loadComponent: () => import('./components/pages/doctor-profile/doctor-profile.component').then(m => m.DoctorProfileComponent)
          }
        ]
      },

    ]
  },
  // auth 
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
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
        path: 'reset-password',
        component: ResetPasswordComponent
      },
      {
        path: 'confirm-success',         //token ,email 
        component: ConfirmEmailComponent // This can be a component that shows a success message after email confirmation
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        canActivate: [authGuard],
      }
      // add doctor register route
    ]
  },


  // admin layout
  {

    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        title: 'Admin Dashboard - Doctor Appointments',
        component: AdminDashboardComponent
      }
    ]
  },
  {
    path: 'test',
    component: TestSwiperComponent,
  }
  ,
  {
    path: 'extrenal-login',
    component: ExtrenalLoginComponent,
  }
  ,
  //NotFound
  {
    path: '**',
    component: NotFoundComponent, title: 'NotFound'
  }

]
