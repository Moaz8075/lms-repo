import { apiClient, unwrap } from '@/api/axios';
import type { DashboardData } from '@/types/dashboard';

export const dashboardApi = {
  getDashboard: () => unwrap<DashboardData>(apiClient.get('/dashboard')),
};
