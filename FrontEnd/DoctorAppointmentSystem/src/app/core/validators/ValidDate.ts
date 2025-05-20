import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ValidDate(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    if (!control.value) return null; 

    if (inputDate >= today) {
      return { validDate: 'Birth date must be in the past' };
    }

    return null;
  };
}
