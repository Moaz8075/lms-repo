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
import { AddClientModal } from '@/components/modals/AddClientModal';
import { ActiveStatusChip } from '@/components/ui/StatusChip';
import { useClients } from '@/hooks/useClients';
import { RequireAccess } from '@/components/auth/RequireAccess';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionResource } from '@/types/permissions';
import type { Client } from '@/types';

const DEFAULT_LIMIT = 20;

export default function ClientsPage() {
  const { canWrite } = usePermissions();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const { data, isLoading, isError } = useClients({
    search: search || undefined,
    page,
    limit,
  });

  return (
    <RequireAccess resource={PermissionResource.CLIENTS}>
      <>
      <PageHeader
        title="Clients"
        subtitle="Manage your firm's client directory"
        action={
          canWrite(PermissionResource.CLIENTS) ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
              Add Client
            </Button>
          ) : undefined
        }
      />

      <Box sx={{ mb: 2, maxWidth: 400 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name…" />
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <DataTable<Client>
          loading={isLoading}
          rows={data?.items ?? []}
          accentColor="blue"
          showRowNumbers
          rowNumberOffset={(page - 1) * limit}
          title="All Clients"
          totalCount={data?.total}
          emptyMessage={
            isError
              ? 'Unable to load clients. Ensure the backend API is running.'
              : 'No clients found'
          }
          getRowId={(row) => row.id}
          columns={[
            {
              id: 'name',
              label: 'Name',
              render: (row) => (
                <Link component={NextLink} href={`/clients/${row.id}`} underline="hover">
                  {row.name}
                </Link>
              ),
            },
            { id: 'cnic', label: 'CNIC', render: (row) => row.cnic ?? '—' },
            { id: 'phone', label: 'Phone', render: (row) => row.phone },
            { id: 'city', label: 'City', render: (row) => row.city ?? '—' },
            {
              id: 'status',
              label: 'Status',
              render: (row) => <ActiveStatusChip active={row.isActive} />,
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

      <AddClientModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    </RequireAccess>
  );
}
