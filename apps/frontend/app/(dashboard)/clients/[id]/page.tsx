'use client';

import { use } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Skeleton from '@mui/material/Skeleton';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import NextLink from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { InfoCard } from '@/components/ui/InfoCard';
import { CaseStatusChip, ActiveStatusChip } from '@/components/ui/StatusChip';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { useClient } from '@/hooks/useClients';
import { formatDate } from '@/utils/format';
import type { ClientCaseSummary } from '@/types';

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = use(params);
  const { data: client, isLoading, isError } = useClient(id);

  if (isLoading) {
    return (
      <>
        <Skeleton variant="text" width={300} height={40} />
        <Skeleton variant="rectangular" height={200} sx={{ mt: 2, borderRadius: 2 }} />
      </>
    );
  }

  if (isError || !client) {
    return (
      <PageHeader
        title="Client Details"
        subtitle="Unable to load client. Ensure the backend API is running."
      />
    );
  }

  return (
    <>
      <PageHeader
        title={client.name}
        subtitle={`${client.totalCases} case(s) on record`}
        action={<ActiveStatusChip active={client.isActive} />}
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard label="Phone" value={client.phone} icon={<PhoneOutlinedIcon />} color="blue" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard label="CNIC" value={client.cnic ?? '—'} icon={<BadgeOutlinedIcon />} color="indigo" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard label="City" value={client.city ?? '—'} icon={<LocationCityOutlinedIcon />} color="teal" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard label="Email" value={client.email ?? '—'} icon={<EmailOutlinedIcon />} color="violet" />
        </Grid>
      </Grid>

      {client.address && (
        <Card sx={{ mb: 3, bgcolor: '#F4F8FF', border: '1px solid #C2D9F7' }}>
          <CardContent>
            <Typography variant="body2" sx={{ color: '#1557B0', fontWeight: 700, mb: 0.5 }}>
              Address
            </Typography>
            <Typography variant="body1" fontWeight={500}>{client.address}</Typography>
          </CardContent>
        </Card>
      )}

      <PageHeader title="Recent Cases" subtitle="Cases linked to this client" />
      <DataTable<ClientCaseSummary>
        rows={client.recentCases}
        accentColor="violet"
        showRowNumbers
        emptyMessage="No cases for this client yet"
        getRowId={(row) => row.id}
        columns={[
          {
            id: 'caseNumber',
            label: 'Case #',
            render: (row) => (
              <Link component={NextLink} href={`/cases/${row.id}`} underline="hover">
                <MonoLabel>{row.caseNumber}</MonoLabel>
              </Link>
            ),
          },
          { id: 'title', label: 'Title', render: (row) => row.title },
          {
            id: 'status',
            label: 'Status',
            render: (row) => <CaseStatusChip status={row.status} />,
          },
          { id: 'court', label: 'Court', render: (row) => row.courtName ?? '—' },
          {
            id: 'nextHearing',
            label: 'Next Hearing',
            render: (row) => formatDate(row.nextHearingDate),
          },
        ]}
      />
    </>
  );
}
