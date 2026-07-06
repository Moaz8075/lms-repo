'use client';

import { useEffect, useState } from 'react';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import NextLink from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { SearchBar } from '@/components/ui/SearchBar';
import { TablePaginationBar } from '@/components/ui/TablePagination';
import { FilterChipBar } from '@/components/ui/FilterChipBar';
import { CaseStatusChip, CaseTypeChip } from '@/components/ui/StatusChip';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { AddCaseModal } from '@/components/modals/AddCaseModal';
import { useCases } from '@/hooks/useCases';
import { RequireAccess } from '@/components/auth/RequireAccess';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionResource } from '@/types/permissions';
import { CaseStatus } from '@/types';
import { formatDate } from '@/utils/format';
import type { Case } from '@/types';

const DEFAULT_LIMIT = 20;

const STATUS_FILTERS = [
  { value: '' as const, label: 'All', color: 'blue' as const },
  { value: CaseStatus.OPEN, label: 'Open', color: 'blue' as const },
  { value: CaseStatus.IN_PROGRESS, label: 'In Progress', color: 'amber' as const },
  { value: CaseStatus.CLOSED, label: 'Closed', color: 'green' as const },
  { value: CaseStatus.ARCHIVED, label: 'Archived', color: 'violet' as const },
];

export default function CasesPage() {
  const { canWrite } = usePermissions();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | ''>('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const { data, isLoading, isError } = useCases({
    search: search || undefined,
    status: statusFilter || undefined,
    page,
    limit,
  });

  return (
    <RequireAccess resource={PermissionResource.CASES}>
      <>
      <PageHeader
        title="Cases"
        subtitle="Track and manage all legal cases"
        action={
          canWrite(PermissionResource.CASES) ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
              New Case
            </Button>
          ) : undefined
        }
      />

      <Box sx={{ mb: 2, maxWidth: 400 }}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by case #, title, client, court…"
        />
      </Box>

      <FilterChipBar
        options={STATUS_FILTERS}
        value={statusFilter}
        onChange={setStatusFilter}
      />

      <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <DataTable<Case>
          loading={isLoading}
          rows={data?.items ?? []}
          accentColor="indigo"
          showRowNumbers
          rowNumberOffset={(page - 1) * limit}
          title="All Cases"
          totalCount={data?.total}
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
                  <MonoLabel>{row.caseNumber}</MonoLabel>
                </Link>
              ),
            },
            { id: 'title', label: 'Title', render: (row) => row.title },
            {
              id: 'type',
              label: 'Type',
              render: (row) => <CaseTypeChip caseType={row.caseType} />,
            },
            { id: 'client', label: 'Client', render: (row) => row.client?.name ?? '—' },
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
        <TablePaginationBar
          page={page}
          limit={limit}
          total={data?.total ?? 0}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      </Paper>

      <AddCaseModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    </RequireAccess>
  );
}
