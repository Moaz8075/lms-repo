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
  DIARY_NEW: '/(protected)/(tabs)/diary/new',
  DIARY_CALENDAR: '/(protected)/(tabs)/diary/calendar',
  LEGAL_RESEARCH: '/(protected)/(tabs)/legal-research',
  LEGAL_LIBRARY: '/(protected)/(tabs)/legal-research/library',
  MORE: '/(protected)/(tabs)/more',
  CLIENTS: '/(protected)/(tabs)/more/clients',
  CLIENT_NEW: '/(protected)/(tabs)/more/clients/new',
} as const;

export const ROUTES = {
  AUTH: AUTH_ROUTES,
  PROTECTED: PROTECTED_ROUTES,
} as const;

export const DEFAULT_AUTHENTICATED_ROUTE = PROTECTED_ROUTES.DASHBOARD;
