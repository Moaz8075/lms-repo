'use client';

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { useClients } from '@/hooks/useClients';
import { formatFullName } from '@/utils/format';
import type { Client } from '@/types';

export default function ClientsPage() {
  const { data, isLoading, isError } = useClients();

  return (
    <>
      <PageHeader
        title="Clients"
        subtitle="Manage your firm's client directory"
        action={
          <Button variant="contained" startIcon={<AddIcon />} disabled>
            Add Client
          </Button>
        }
      />

      <DataTable<Client>
        loading={isLoading}
        rows={data?.items ?? []}
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
            render: (row) => formatFullName(row.firstName, row.lastName),
          },
          { id: 'phone', label: 'Phone', render: (row) => row.phone },
          { id: 'cnic', label: 'CNIC', render: (row) => row.cnic ?? '—' },
          { id: 'email', label: 'Email', render: (row) => row.email ?? '—' },
          { id: 'city', label: 'City', render: (row) => row.city ?? '—' },
        ]}
      />
    </>
  );
}
