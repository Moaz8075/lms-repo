import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { dashboardApi } from '@/api/dashboard.api';
import {
  DASHBOARD_REFETCH_INTERVAL_MS,
  dashboardKeys,
} from '@/features/dashboard/constants';

export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.all,
    queryFn: () => dashboardApi.getDashboard(),
    refetchInterval: DASHBOARD_REFETCH_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });
}

export function useRefreshDashboard() {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
}
