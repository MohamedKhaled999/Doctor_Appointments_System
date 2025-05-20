export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: {
    email: string;
    name: string;
    roles: string[];
  };
}