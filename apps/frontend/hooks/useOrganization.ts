import { useQuery } from '@tanstack/react-query';
import { organizationService } from '@/services/organization.service';

export function useOrganization() {
  return useQuery({
    queryKey: ['organization', 'me'],
    queryFn: () => organizationService.getMe(),
  });
}

export function useOrganizationStats() {
  return useQuery({
    queryKey: ['organization', 'stats'],
    queryFn: () => organizationService.getStats(),
  });
}
