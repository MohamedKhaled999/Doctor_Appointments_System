export interface ResetPasswordVM {
    newPassword: string;
    confirmPassword: string;
    email?: string;
    token?: string;
  }