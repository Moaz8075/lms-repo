import { apiClient, unwrap } from '@/api/axios';
import type {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
} from '@/features/auth/types';
import type {
  LoginPayload,
  LoginResponse,
  ProfileResponse,
  RegisterPayload,
} from '@/types';

export const authApi = {
  login: (payload: LoginPayload) =>
    unwrap<LoginResponse>(apiClient.post('/auth/login', payload)),

  register: (payload: RegisterPayload) =>
    unwrap<LoginResponse>(apiClient.post('/auth/register', payload)),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    unwrap<ForgotPasswordResponse>(apiClient.post('/auth/forgot-password', payload)),

  logout: () => unwrap<void>(apiClient.post('/auth/logout')),

  refreshToken: (payload: RefreshTokenPayload) =>
    unwrap<RefreshTokenResponse>(apiClient.post('/auth/refresh', payload)),

  getProfile: () => unwrap<ProfileResponse>(apiClient.get('/auth/me')),

  /** @deprecated Use getProfile */
  me: () => unwrap<ProfileResponse>(apiClient.get('/auth/me')),
};
