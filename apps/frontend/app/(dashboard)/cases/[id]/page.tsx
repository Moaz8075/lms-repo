'use client';

import { use } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Skeleton from '@mui/material/Skeleton';
import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { CaseStatusChip } from '@/components/ui/StatusChip';
import { useCase } from '@/hooks/useCases';
import { formatDate } from '@/utils/format';

const TABS = ['Overview', 'Hearings', 'Diary', 'Documents', 'Payments', 'Expenses'];

interface CaseDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function CaseDetailsPage({ params }: CaseDetailsPageProps) {
  const { id } = use(params);
  const { data: caseData, isLoading, isError } = useCase(id);
  const [tab, setTab] = useState(0);

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={300} height={40} />
        <Skeleton variant="rectangular" height={200} sx={{ mt: 2, borderRadius: 2 }} />
      </Box>
    );
  }

  if (isError || !caseData) {
    return (
      <PageHeader
        title="Case Details"
        subtitle="Unable to load case. Ensure the backend API is running."
      />
    );
  }

  return (
    <>
      <PageHeader
        title={caseData.title}
        subtitle={`Case #${caseData.caseNumber}`}
        action={<CaseStatusChip status={caseData.status} />}
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Court
              </Typography>
              <Typography variant="body1">{caseData.courtName ?? '—'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Next Hearing
              </Typography>
              <Typography variant="body1">{formatDate(caseData.nextHearingDate)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Created
              </Typography>
              <Typography variant="body1">{formatDate(caseData.createdAt)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        {TABS.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>

      <Card>
        <CardContent>
          <Typography color="text.secondary">
            {TABS[tab]} content will be connected to the backend API.
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}
