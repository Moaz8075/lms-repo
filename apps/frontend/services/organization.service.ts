import { api, unwrap } from './api';
import type { Organization, OrganizationStats } from '@/types';
import type { RolePermissionsMatrix, UserAccess } from '@/types/permissions';

export const organizationService = {
  getMe: () => unwrap<Organization>(api.get('/organizations/me')),

  getStats: () => unwrap<OrganizationStats>(api.get('/organizations/stats')),

  getMyAccess: () => unwrap<UserAccess>(api.get('/organizations/me/access')),

  getPermissionsMatrix: () =>
    unwrap<RolePermissionsMatrix>(api.get('/organizations/permissions')),

  updatePermissionsMatrix: (permissions: RolePermissionsMatrix['permissions']) =>
    unwrap<RolePermissionsMatrix>(api.patch('/organizations/permissions', { permissions })),
};
