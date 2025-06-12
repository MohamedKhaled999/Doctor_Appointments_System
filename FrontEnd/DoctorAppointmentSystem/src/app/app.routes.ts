import { SearchComponent } from './components/pages/search/search.component';
import { Routes } from '@angular/router';
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
import { authGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { ContactComponent } from './components/contact/contact.component';
import { AdminDashboardComponent } from './components/pages/Dashboard/admin-dashboard/admin-dashboard.component';


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
        title: 'Home - DocNet'
      }
      ,
      {
        path: 'contact',
        component: ContactComponent,
        title: 'Contact Us - DocNet'
      }
      ,

      {
        path: 'profile',
        children: [
          {
            path: '',
            redirectTo: 'not-found',
            pathMatch: 'full'
          },
          {
            path: 'patient',
            loadComponent: () => import('./components/pages/patient-profile/patient-profile.component').then(m => m.PatientProfileComponent),
            title: 'Patient Profile',
            canActivate: [authGuard]
          },
          {
            path: 'doctor',
            loadComponent: () => import('./components/pages/doctor-profile/doctor-profile.component').then(m => m.DoctorProfileComponent),
            title: 'Doctor Profile',
            canActivate: [authGuard]
          },
          {
            path: 'doctor/edit',
            loadComponent: () => import('./components/pages/doctor-edit/doctor-edit.component').then(m => m.DoctorEditComponent),
            title: 'Edit Profile',
            canActivate: [authGuard]
          },
          {
            path: 'doctor/:id',
            loadComponent: () => import('./components/pages/doctor-profile/doctor-profile.component').then(m => m.DoctorProfileComponent),
            title: 'Doctor Profile',
          }
        ]
      },
      {
        path: 'search/payment-success',
        component: SearchComponent,
        title: 'Search - DocNet'
      },
      {
        path: 'search/payment-failed',
        component: SearchComponent,
        title: 'Search - DocNet'
      },
      {
        path: 'search',
        component: SearchComponent,
        title: 'Search - DocNet'
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
        title: 'Register - DocNet'
      },
      {
        path: 'login',
        component: LoginComponent,
        title: 'Login - DocNet'
      },
      {
        path: 'forgot-password',
        component: ForgetPasswordComponent,
        title: 'Password Recovery - DocNet'
      },
      {
        path: 'need-to-confirm',
        component: NeedToConfirmComponent,
        title: 'Need to Confirm - DocNet'
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        title: "Reset Password - DocNet"
      },
      {
        path: 'doctor-register',
        loadComponent: () => import('./components/pages/account/doctor-register/doctor-register.component').then(m => m.DoctorRegisterComponent),
        title: "Join Us - DocNet"
      },
      {
        path: 'confirm-success',
        component: ConfirmEmailComponent,
        title: "Confirm Email - DocNet"
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        canActivate: [authGuard],
        title: "Change Password - DocNet"
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
        title: 'Admin Dashboard - DocNet',
        component: AdminDashboardComponent
      }
    ]
  }
  ,
  {
    path: '**',
    component: NotFoundComponent, title: 'Page Not Found'
  }
]