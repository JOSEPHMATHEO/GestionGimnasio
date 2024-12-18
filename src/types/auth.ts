export type Role = 'admin' | 'manager' | 'trainer' | 'client';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  user: User;
  token: string;
}