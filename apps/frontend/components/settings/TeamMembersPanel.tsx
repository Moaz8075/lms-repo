'use client';

import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import { DataTable } from '@/components/ui/DataTable';
import { useAuth } from '@/hooks/useAuth';
import { useDeactivateUser, useTeamMembers, useUpdateUserRole } from '@/hooks/useUsers';
import {
  API_USER_ROLE_LABELS,
  ApiUserRole,
  type OrgUser,
} from '@/types';
import { formatDateTime } from '@/utils/format';

const ASSIGNABLE_ROLES = Object.values(ApiUserRole);

function normalizeApiRole(role: string): ApiUserRole {
  if (role === 'ORG_ADMIN') return ApiUserRole.OWNER;
  if (ASSIGNABLE_ROLES.includes(role as ApiUserRole)) return role as ApiUserRole;
  return ApiUserRole.ASSOCIATE;
}

function formatRoleLabel(role: string): string {
  if (role === 'ORG_ADMIN') return API_USER_ROLE_LABELS[ApiUserRole.OWNER];
  return API_USER_ROLE_LABELS[role as ApiUserRole] ?? role.replace(/_/g, ' ');
}

export function TeamMembersPanel() {
  const { user: currentUser } = useAuth();
  const { data, isLoading, isError } = useTeamMembers({ limit: 50 });
  const updateRole = useUpdateUserRole();
  const deactivateUser = useDeactivateUser();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRoleChange = async (member: OrgUser, role: ApiUserRole) => {
    setError(null);
    setSuccess(null);
    try {
      await updateRole.mutateAsync({ id: member.id, role });
      setSuccess(`Role updated for ${member.name}`);
    } catch {
      setError(`Failed to update role for ${member.name}`);
    }
  };

  const handleDeactivate = async (member: OrgUser) => {
    setError(null);
    setSuccess(null);
    try {
      await deactivateUser.mutateAsync(member.id);
      setSuccess(`${member.name} has been deactivated`);
    } catch {
      setError(`Failed to deactivate ${member.name}`);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Team members
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          View your organization&apos;s users and assign roles. You cannot change your own role.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <DataTable<OrgUser>
          loading={isLoading}
          rows={data?.items ?? []}
          accentColor="indigo"
          title="Team"
          totalCount={data?.total}
          emptyMessage={
            isError
              ? 'Unable to load team members. Ensure you are signed in as admin.'
              : 'No team members found'
          }
          getRowId={(row) => row.id}
          columns={[
            {
              id: 'name',
              label: 'Name',
              render: (row) => (
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {row.name}
                    {row.id === currentUser?.id && (
                      <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                        (you)
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.email}
                  </Typography>
                </Box>
              ),
            },
            {
              id: 'role',
              label: 'Role',
              render: (row) => {
                const isSelf = row.id === currentUser?.id;
                const roleValue = normalizeApiRole(String(row.role));

                if (isSelf || !row.isActive) {
                  return (
                    <Chip
                      label={formatRoleLabel(String(row.role))}
                      size="small"
                      color={row.role === ApiUserRole.OWNER || row.role === 'ORG_ADMIN' ? 'primary' : 'default'}
                    />
                  );
                }

                return (
                  <Select
                    size="small"
                    value={roleValue}
                    disabled={updateRole.isPending}
                    onChange={(e) => handleRoleChange(row, e.target.value as ApiUserRole)}
                    sx={{ minWidth: 160 }}
                  >
                    {ASSIGNABLE_ROLES.map((role) => (
                      <MenuItem key={role} value={role}>
                        {API_USER_ROLE_LABELS[role]}
                      </MenuItem>
                    ))}
                  </Select>
                );
              },
            },
            {
              id: 'status',
              label: 'Status',
              render: (row) => (
                <Chip
                  label={row.isActive ? 'Active' : 'Inactive'}
                  size="small"
                  color={row.isActive ? 'success' : 'default'}
                  variant="outlined"
                />
              ),
            },
            {
              id: 'lastLogin',
              label: 'Last login',
              render: (row) => (
                <Typography variant="body2" color="text.secondary">
                  {formatDateTime(row.lastLoginAt)}
                </Typography>
              ),
            },
            {
              id: 'actions',
              label: '',
              render: (row) => {
                const isSelf = row.id === currentUser?.id;
                if (isSelf || !row.isActive) return null;

                return (
                  <IconButton
                    size="small"
                    aria-label={`Deactivate ${row.name}`}
                    disabled={deactivateUser.isPending}
                    onClick={() => handleDeactivate(row)}
                  >
                    <PersonOffOutlinedIcon fontSize="small" />
                  </IconButton>
                );
              },
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
