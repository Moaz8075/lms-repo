import type { LoginPayload, LoginResponse, ProfileResponse, RegisterPayload } from '@/types';

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export type { LoginPayload, LoginResponse, ProfileResponse, RegisterPayload };
