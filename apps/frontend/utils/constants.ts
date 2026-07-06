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
  legalResearch: '/legal-research',
  settings: '/settings',
} as const;

export const NAV_ITEMS = [
  { label: 'Dashboard', href: ROUTES.dashboard, icon: 'Dashboard', resource: 'dashboard' as const },
  { label: 'Clients', href: ROUTES.clients, icon: 'People', resource: 'clients' as const },
  { label: 'Cases', href: ROUTES.cases, icon: 'Gavel', resource: 'cases' as const },
  { label: 'Case Diary', href: ROUTES.diary, icon: 'MenuBook', resource: 'diary' as const },
  { label: 'Legal Research', href: ROUTES.legalResearch, icon: 'LibraryBooks', resource: 'legal_research' as const },
  { label: 'Payments', href: ROUTES.payments, icon: 'Payments', resource: 'payments' as const },
  { label: 'Expenses', href: ROUTES.expenses, icon: 'Receipt', resource: 'expenses' as const },
  { label: 'Settings', href: ROUTES.settings, icon: 'Settings', adminOnly: true as const },
] as const;
