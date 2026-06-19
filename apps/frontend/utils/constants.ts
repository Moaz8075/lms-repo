export const AUTH_TOKEN_KEY = 'legalease_access_token';
export const AUTH_REFRESH_TOKEN_KEY = 'legalease_refresh_token';
export const AUTH_COOKIE_KEY = 'legalease_auth';

export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_COLLAPSED_WIDTH = 72;

export const ROUTES = {
  login: '/login',
  register: '/register',
  dashboard: '/',
  clients: '/clients',
  cases: '/cases',
  hearings: '/hearings',
  diary: '/diary',
  documents: '/documents',
  payments: '/payments',
  expenses: '/expenses',
  settings: '/settings',
} as const;

export const NAV_ITEMS = [
  { label: 'Dashboard', href: ROUTES.dashboard, icon: 'Dashboard' },
  { label: 'Clients', href: ROUTES.clients, icon: 'People' },
  { label: 'Cases', href: ROUTES.cases, icon: 'Gavel' },
  { label: 'Hearings', href: ROUTES.hearings, icon: 'Event' },
  { label: 'Case Diary', href: ROUTES.diary, icon: 'MenuBook' },
  { label: 'Documents', href: ROUTES.documents, icon: 'Folder' },
  { label: 'Payments', href: ROUTES.payments, icon: 'Payments' },
  { label: 'Expenses', href: ROUTES.expenses, icon: 'Receipt' },
  { label: 'Settings', href: ROUTES.settings, icon: 'Settings' },
] as const;
