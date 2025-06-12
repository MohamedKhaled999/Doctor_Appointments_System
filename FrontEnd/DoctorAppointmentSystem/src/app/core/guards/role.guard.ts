import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
import { UserManagementData } from './../interfaces/user-management-data';
import { CanActivateFn, Router } from '@angular/router';
import { DataManagementService } from '../services/data-management.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const userService = inject(DataManagementService);
    const toastrService = inject(ToastrService);
    const router = inject(Router);
    const userRole = userService.UserRole();

    if (allowedRoles.includes(userRole)) {
      return true;
    } else {

    toastrService.error(`You signed in as ${userRole}`, 'Not allowed user', {
        timeOut: 2000
      });
      router.navigate(['/login'])
      return false;
    }
  };
};