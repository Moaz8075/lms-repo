'use client';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import PeopleIcon from '@mui/icons-material/People';
import GavelIcon from '@mui/icons-material/Gavel';
import EventIcon from '@mui/icons-material/Event';
import PaymentsIcon from '@mui/icons-material/Payments';
import NextLink from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { CaseStatusChip, HearingOutcomeChip } from '@/components/ui/StatusChip';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { useAuth } from '@/hooks/useAuth';
import { useOrganizationStats } from '@/hooks/useOrganization';
import { useCases } from '@/hooks/useCases';
import { formatDate, getGreeting } from '@/utils/format';
import type { Case } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: stats } = useOrganizationStats();
  const { data: casesData, isLoading } = useCases({ limit: 5 });

  const recentCases = casesData?.items ?? [];
  const upcomingHearings = recentCases.filter((c) => c.nextHearingDate);

  return (
    <>
      <PageHeader
        title={`${getGreeting()}${user ? `, ${user.firstName}` : ''}`}
        subtitle="Overview of your firm's cases and activity"
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Total Clients"
            value={stats?.totalClients ?? '—'}
            icon={<PeopleIcon />}
            color="blue"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Total Cases"
            value={stats?.totalCases ?? '—'}
            icon={<GavelIcon />}
            color="indigo"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Upcoming Hearings"
            value={upcomingHearings.length}
            icon={<EventIcon />}
            color="amber"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Team Members"
            value={stats?.totalUsers ?? '—'}
            icon={<PaymentsIcon />}
            color="green"
          />
        </Grid>
      </Grid>

      <Paper
        sx={{
          p: 2.5,
          mb: 2,
          bgcolor: '#F4F8FF',
          border: '1px solid #C2D9F7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#1557B0' }}>
          Recent Cases
        </Typography>
        <Link component={NextLink} href="/cases" underline="hover" fontWeight={600}>
          View all →
        </Link>
      </Paper>

      <DataTable<Case>
        loading={isLoading}
        rows={recentCases}
        accentColor="blue"
        showRowNumbers
        emptyMessage="No cases yet. Create your first case to get started."
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
          { id: 'client', label: 'Client', render: (row) => row.client?.name ?? '—' },
          {
            id: 'status',
            label: 'Status',
            render: (row) => <CaseStatusChip status={row.status} />,
          },
          {
            id: 'nextHearing',
            label: 'Next Hearing',
            render: (row) => formatDate(row.nextHearingDate),
          },
        ]}
      />

      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 2,
              mb: 1.5,
              bgcolor: '#FFFBF0',
              border: '1px solid #F9E6A8',
            }}
          >
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#B45309' }}>
              Upcoming Hearings
            </Typography>
          </Paper>
          <DataTable<Case>
            rows={upcomingHearings.slice(0, 5)}
            emptyMessage="No upcoming hearings scheduled"
            getRowId={(row) => row.id}
            columns={[
              {
                id: 'caseNumber',
                label: 'Case #',
                render: (row) => <MonoLabel>{row.caseNumber}</MonoLabel>,
              },
              { id: 'court', label: 'Court', render: (row) => row.courtName ?? '—' },
              {
                id: 'date',
                label: 'Date',
                render: (row) => formatDate(row.nextHearingDate),
              },
              {
                id: 'status',
                label: 'Status',
                render: () => <HearingOutcomeChip outcome="PENDING" />,
              },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 2,
              mb: 1.5,
              bgcolor: '#F0FAF3',
              border: '1px solid #B7DFC0',
            }}
          >
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#15803D' }}>
              Recent Payments
            </Typography>
          </Paper>
          <Box
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: '#F0FAF3',
              border: '1px dashed #B7DFC0',
              borderRadius: 3,
            }}
          >
            <Typography color="text.secondary">
              Select a case on the Payments page to view payment history
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
