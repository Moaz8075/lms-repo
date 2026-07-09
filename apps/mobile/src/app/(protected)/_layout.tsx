import { Redirect, Stack } from 'expo-router';

import { AUTH_ROUTES } from '@/constants/routes';
import { useAuthContext } from '@/providers/AuthProvider';

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (!isLoading && !isAuthenticated) {
    return <Redirect href={AUTH_ROUTES.LOGIN} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
