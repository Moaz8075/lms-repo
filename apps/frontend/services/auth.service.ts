import { api, unwrap } from './api';
import type { LoginPayload, LoginResponse, ProfileResponse, RegisterPayload } from '@/types';

export const authService = {
  login: (payload: LoginPayload) =>
    unwrap<LoginResponse>(api.post('/auth/login', payload)),

  register: (payload: RegisterPayload) =>
    unwrap<LoginResponse>(api.post('/auth/register', payload)),

  logout: () => unwrap<void>(api.post('/auth/logout')),

  me: () => unwrap<ProfileResponse>(api.get('/auth/me')),
};
