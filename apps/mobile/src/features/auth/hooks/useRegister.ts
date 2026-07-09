import { useMutation } from '@tanstack/react-query';

import { authService } from '@/features/auth/services';
import type { RegisterFormValues } from '@/features/auth/validation';

export function useRegister() {
  return useMutation({
    mutationFn: (values: RegisterFormValues) => authService.register(values),
  });
}
