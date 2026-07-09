import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

import { AUTH_ROUTES } from '@/constants/routes';
import { authService } from '@/features/auth/services';

export function useLogout() {
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      router.replace(AUTH_ROUTES.LOGIN);
    },
  });
}
