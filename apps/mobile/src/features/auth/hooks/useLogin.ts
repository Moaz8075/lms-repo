import { useMutation } from '@tanstack/react-query';

import { authService } from '@/features/auth/services';
import type { LoginFormValues } from '@/features/auth/validation';

export function useLogin() {
  return useMutation({
    mutationFn: (values: LoginFormValues) => authService.login(values),
  });
}
