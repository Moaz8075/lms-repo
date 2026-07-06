import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { organizationService } from '@/services/organization.service';
import type { RolePermissionsMatrix } from '@/types/permissions';

export function useRolePermissionsMatrix() {
  return useQuery({
    queryKey: ['organization', 'permissions'],
    queryFn: () => organizationService.getPermissionsMatrix(),
  });
}

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (permissions: RolePermissionsMatrix['permissions']) =>
      organizationService.updatePermissionsMatrix(permissions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', 'permissions'] });
    },
  });
}
