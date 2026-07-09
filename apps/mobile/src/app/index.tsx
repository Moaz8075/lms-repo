import { Redirect } from 'expo-router';

import { AUTH_ROUTES, DEFAULT_AUTHENTICATED_ROUTE } from '@/constants/routes';
import { useAuthContext } from '@/providers/AuthProvider';

export default function IndexScreen() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Redirect href={DEFAULT_AUTHENTICATED_ROUTE} />;
  }

  return <Redirect href={AUTH_ROUTES.LOGIN} />;
}
