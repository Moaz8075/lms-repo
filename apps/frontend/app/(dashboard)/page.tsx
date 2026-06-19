import Grid from '@mui/material/Grid';
import PeopleIcon from '@mui/icons-material/People';
import GavelIcon from '@mui/icons-material/Gavel';
import EventIcon from '@mui/icons-material/Event';
import PaymentsIcon from '@mui/icons-material/Payments';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { CaseStatus } from '@/types';
import { CaseStatusChip } from '@/components/ui/StatusChip';
import { formatDate } from '@/utils/format';

const PLACEHOLDER_STATS = [
  { label: 'Active Clients', value: '—', icon: <PeopleIcon color="primary" /> },
  { label: 'Open Cases', value: '—', icon: <GavelIcon color="primary" /> },
  { label: 'Upcoming Hearings', value: '—', icon: <EventIcon color="primary" /> },
  { label: 'Pending Payments', value: '—', icon: <PaymentsIcon color="primary" /> },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your firm's cases and activity"
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {PLACEHOLDER_STATS.map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard label={stat.label} value={stat.value} icon={stat.icon} />
          </Grid>
        ))}
      </Grid>

      <PageHeader title="Recent Cases" subtitle="Latest case activity" />
      <DataTable
        columns={[
          { id: 'caseNumber', label: 'Case #', render: () => '—' },
          { id: 'title', label: 'Title', render: () => '—' },
          { id: 'client', label: 'Client', render: () => '—' },
          {
            id: 'status',
            label: 'Status',
            render: () => <CaseStatusChip status={CaseStatus.OPEN} />,
          },
          { id: 'nextHearing', label: 'Next Hearing', render: () => formatDate(null) },
        ]}
        rows={[]}
        getRowId={() => 'placeholder'}
        emptyMessage="Connect to the API to view recent cases"
      />
    </>
  );
}
