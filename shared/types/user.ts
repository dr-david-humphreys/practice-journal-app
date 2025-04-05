export enum UserRole {
  STUDENT = 'student',
  PARENT = 'parent',
  DIRECTOR = 'director'
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
