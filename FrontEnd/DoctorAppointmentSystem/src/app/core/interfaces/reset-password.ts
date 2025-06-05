// export interface ResetPassword {
//     newPassword: string;
//     email?: string;
//     token?: string;
//   }
export interface ResetPassword {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword?: string; 
}