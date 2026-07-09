'use client';

import { Suspense, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import { PageHeader } from '@/components/ui/PageHeader';
import { CaseSelect } from '@/components/ui/CaseSelect';
import { DataTable } from '@/components/ui/DataTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { AddHearingModal } from '@/components/modals/AddHearingModal';
import { useSelectedCaseId } from '@/hooks/useCaseSelection';
import { useHearings } from '@/hooks/useHearings';
import { formatDate, formatTime } from '@/utils/format';
import type { Hearing } from '@/types';

function HearingsContent() {
  const { caseId } = useSelectedCaseId();
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading } = useHearings(caseId ? { caseId } : undefined);

  if (!caseId) {
    return (
      <EmptyState
        title="Select a case"
        message="Choose a case from the dropdown above to view its hearings."
      />
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setModalOpen(true)}>
          Add Hearing
        </Button>
      </Box>
      <DataTable<Hearing>
        loading={isLoading}
        rows={data?.items ?? []}
        emptyMessage="No hearings for this case"
        getRowId={(row) => row.id}
        columns={[
          { id: 'date', label: 'Date', render: (row) => formatDate(row.hearingDate) },
          { id: 'time', label: 'Time', render: (row) => formatTime(row.time) },
          { id: 'courtRoom', label: 'Court Room', render: (row) => row.courtRoom ?? '—' },
          { id: 'purpose', label: 'Purpose', render: (row) => row.purpose ?? '—' },
        ]}
      />
      <AddHearingModal open={modalOpen} onClose={() => setModalOpen(false)} caseId={caseId} />
    </>
  );
}

export default function HearingsPage() {
  return (
    <>
      <PageHeader
        title="Hearings"
        subtitle="Upcoming and past court hearings"
        action={<CaseSelect />}
      />
      <Suspense
        fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={32} />
          </Box>
        }
      >
        <HearingsContent />
      </Suspense>
    </>
  );
}
