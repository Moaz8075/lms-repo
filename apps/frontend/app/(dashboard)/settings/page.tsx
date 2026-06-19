'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsPage() {
  const { user, organization } = useAuth();

  return (
    <>
      <PageHeader title="Settings" subtitle="Organization and account preferences" />

      <Card sx={{ maxWidth: 560 }}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Organization
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {organization?.name ?? '—'}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Account
          </Typography>
          <Typography variant="body2">
            {user ? `${user.firstName} ${user.lastName}` : '—'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email ?? '—'}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" mt={1}>
            Role: {user?.role ?? '—'}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}
