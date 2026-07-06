'use client';

import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import SaveIcon from '@mui/icons-material/Save';
import {
  useRolePermissionsMatrix,
  useUpdateRolePermissions,
} from '@/hooks/useRolePermissions';
import type { ManageableRole, PermissionResource, ResourceAccess, RolePermissionMap } from '@/types/permissions';
import { MANAGEABLE_ROLES, PERMISSION_RESOURCES, RESOURCE_LABELS, ROLE_LABELS } from '@/types/permissions';
import { completeAccessMap, toggleView, toggleWrite } from '@/utils/permissions';

export function AccessControlPanel() {
  const { data, isLoading } = useRolePermissionsMatrix();
  const updatePermissions = useUpdateRolePermissions();
  const [activeRole, setActiveRole] = useState<ManageableRole>('CLERK');
  const [draft, setDraft] = useState<Record<ManageableRole, RolePermissionMap> | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.permissions) {
      const normalized = {} as Record<ManageableRole, RolePermissionMap>;
      for (const role of MANAGEABLE_ROLES) {
        normalized[role] = completeAccessMap(data.permissions[role]);
      }
      setDraft(normalized);
    }
  }, [data]);

  if (isLoading || !draft) {
    return <Typography color="text.secondary">Loading access rules…</Typography>;
  }

  const roleMap = draft[activeRole];

  const setResourceAccess = (
    resource: PermissionResource,
    field: 'view' | 'write',
    checked: boolean,
  ) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const current = prev[activeRole][resource] ?? { view: false, write: false };
      const next =
        field === 'view' ? toggleView(current, checked) : toggleWrite(current, checked);
      return {
        ...prev,
        [activeRole]: {
          ...prev[activeRole],
          [resource]: next,
        },
      };
    });
    setSaved(false);
  };

  const handleSave = async () => {
    await updatePermissions.mutateAsync(draft);
    setSaved(true);
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Role access control
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose what each role can view or change. Admin always has full access.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={updatePermissions.isPending}
          >
            Save access rules
          </Button>
        </Box>

        {saved && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Access rules saved. Users may need to sign in again to pick up changes.
          </Alert>
        )}

        {updatePermissions.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to save access rules. Please try again.
          </Alert>
        )}

        <Tabs
          value={activeRole}
          onChange={(_, value: ManageableRole) => setActiveRole(value)}
          sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          {MANAGEABLE_ROLES.map((role) => (
            <Tab key={role} label={ROLE_LABELS[role]} value={role} />
          ))}
        </Tabs>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Module</TableCell>
              <TableCell align="center">View</TableCell>
              <TableCell align="center">Write</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {PERMISSION_RESOURCES.map((resource) => {
              const entry = roleMap[resource] ?? { view: false, write: false };
              return (
                <TableRow key={resource}>
                  <TableCell>{RESOURCE_LABELS[resource]}</TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={entry.view}
                      onChange={(e) => setResourceAccess(resource, 'view', e.target.checked)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={entry.write}
                      disabled={!entry.view}
                      onChange={(e) => setResourceAccess(resource, 'write', e.target.checked)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
