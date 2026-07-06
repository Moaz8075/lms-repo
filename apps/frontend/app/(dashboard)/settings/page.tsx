'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import { PageHeader } from '@/components/ui/PageHeader';
import { AdminOnly } from '@/components/auth/RequireAccess';
import { AccessControlPanel } from '@/components/settings/AccessControlPanel';
import { TeamMembersPanel } from '@/components/settings/TeamMembersPanel';
import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/hooks/useOrganization';
import { formatDate } from '@/utils/format';

export default function SettingsPage() {
  const { user } = useAuth();
  const { data: org, isLoading } = useOrganization();

  return (
    <AdminOnly>
      <>
        <PageHeader title="Settings" subtitle="Organization profile, team, and access control" />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Organization
                </Typography>
                {isLoading ? (
                  <Skeleton height={80} />
                ) : (
                  <>
                    <Typography variant="body1" fontWeight={500}>
                      {org?.name ?? '—'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      Slug: {org?.slug ?? '—'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {org?.status ?? '—'}
                    </Typography>
                    {org?.phone && (
                      <Typography variant="body2" mt={1}>
                        Phone: {org.phone}
                      </Typography>
                    )}
                    {org?.address && (
                      <Typography variant="body2" color="text.secondary">
                        {org.address}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                      Created {formatDate(org?.createdAt)}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Admin account
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {user ? `${user.firstName} ${user.lastName}` : '—'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email ?? '—'}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body1">{user?.role ?? '—'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TeamMembersPanel />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <AccessControlPanel />
          </Grid>
        </Grid>
      </>
    </AdminOnly>
  );
}
