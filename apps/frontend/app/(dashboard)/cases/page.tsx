'use client';

import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import NextLink from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { CaseStatusChip } from '@/components/ui/StatusChip';
import { useCases } from '@/hooks/useCases';
import { formatDate, formatFullName } from '@/utils/format';
import type { Case } from '@/types';

export default function CasesPage() {
  const { data, isLoading, isError } = useCases();

  return (
    <>
      <PageHeader
        title="Cases"
        subtitle="Track and manage all legal cases"
        action={
          <Button variant="contained" startIcon={<AddIcon />} disabled>
            New Case
          </Button>
        }
      />

      <DataTable<Case>
        loading={isLoading}
        rows={data?.items ?? []}
        emptyMessage={
          isError
            ? 'Unable to load cases. Ensure the backend API is running.'
            : 'No cases found'
        }
        getRowId={(row) => row.id}
        columns={[
          {
            id: 'caseNumber',
            label: 'Case #',
            render: (row) => (
              <Link component={NextLink} href={`/cases/${row.id}`} underline="hover">
                {row.caseNumber}
              </Link>
            ),
          },
          { id: 'title', label: 'Title', render: (row) => row.title },
          {
            id: 'client',
            label: 'Client',
            render: (row) =>
              row.client
                ? formatFullName(row.client.firstName, row.client.lastName)
                : '—',
          },
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
