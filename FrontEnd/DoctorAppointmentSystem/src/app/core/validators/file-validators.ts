
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function maxFileSize(maxSizeInBytes: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value;
    
    if (file) {
      if (file.size > maxSizeInBytes) {
        return {
          maxFileSize: {
            requiredSize: `${maxSizeInBytes / (1024 * 1024)}MB`,
            actualSize: `${(file.size / (1024 * 1024)).toFixed(2)}MB`
          }
        };
      }
    }
    return null;
  };
}

export function allowedFileTypes(allowedTypes: string[]) {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value;
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !allowedTypes.includes('.' + extension)) {
        return { fileType: true };
      }
    }
    return null;
  };
}