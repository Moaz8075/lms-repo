import { Redirect, Stack } from 'expo-router';

import { AUTH_ROUTES, DEFAULT_AUTHENTICATED_ROUTE } from '@/constants/routes';
import { useAuthContext } from '@/providers/AuthProvider';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (!isLoading && isAuthenticated) {
    return <Redirect href={DEFAULT_AUTHENTICATED_ROUTE} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
