import { api, unwrap } from './api';
import type { OrgUser, PaginatedResult, UpdateUserRolePayload } from '@/types';

export const userService = {
  list: (params?: { page?: number; limit?: number }) =>
    unwrap<PaginatedResult<OrgUser>>(api.get('/users', { params })),

  updateRole: (id: string, payload: UpdateUserRolePayload) =>
    unwrap<OrgUser>(api.patch(`/users/${id}/role`, payload)),

  deactivate: (id: string) => unwrap<OrgUser>(api.patch(`/users/${id}/deactivate`)),
};
