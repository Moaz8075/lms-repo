export const AUTH_ROUTES = {
  LOGIN: '/(auth)/login',
  REGISTER: '/(auth)/register',
  FORGOT_PASSWORD: '/(auth)/forgot-password',
} as const;

export const PROTECTED_ROUTES = {
  DASHBOARD: '/(protected)/(tabs)/dashboard',
  CASES: '/(protected)/(tabs)/cases',
  CASE_NEW: '/(protected)/(tabs)/cases/new',
  DIARY: '/(protected)/(tabs)/diary',
  CLIENTS: '/(protected)/(tabs)/clients',
  MORE: '/(protected)/(tabs)/more',
  HEARINGS: '/(protected)/hearings',
  DOCUMENTS: '/(protected)/documents',
  PAYMENTS: '/(protected)/payments',
  SETTINGS: '/(protected)/settings',
} as const;

/** @deprecated Use PROTECTED_ROUTES */
export const APP_ROUTES = PROTECTED_ROUTES;

export const ROUTES = {
  AUTH: AUTH_ROUTES,
  PROTECTED: PROTECTED_ROUTES,
  APP: PROTECTED_ROUTES,
} as const;

export const DEFAULT_AUTHENTICATED_ROUTE = PROTECTED_ROUTES.DASHBOARD;
