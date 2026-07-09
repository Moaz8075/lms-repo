import { useMutation } from '@tanstack/react-query';

import { authService } from '@/features/auth/services';
import type { ForgotPasswordFormValues } from '@/features/auth/validation';

export function useForgotPassword() {
  return useMutation({
    mutationFn: (values: ForgotPasswordFormValues) =>
      authService.forgotPassword({ email: values.email.trim().toLowerCase() }),
  });
}
