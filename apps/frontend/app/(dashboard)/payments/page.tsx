'use client';

import { Suspense, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { PageHeader } from '@/components/ui/PageHeader';
import { CaseSelect } from '@/components/ui/CaseSelect';
import { DataTable } from '@/components/ui/DataTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatCard } from '@/components/ui/StatCard';
import { PaymentStatusChip } from '@/components/ui/StatusChip';
import { AddPaymentModal } from '@/components/modals/AddPaymentModal';
import { useSelectedCaseId } from '@/hooks/useCaseSelection';
import { usePayments, useDeletePayment } from '@/hooks/usePayments';
import { RequireAccess } from '@/components/auth/RequireAccess';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionResource } from '@/types/permissions';
import { formatCurrency, formatDate } from '@/utils/format';
import type { Payment } from '@/types';

function PaymentsContent() {
  const { canWrite } = usePermissions();
  const { caseId } = useSelectedCaseId();
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading } = usePayments(caseId ? { caseId } : undefined);
  const deletePayment = useDeletePayment();

  if (!caseId) {
    return (
      <EmptyState
        title="Select a case"
        message="Choose a case from the dropdown above to view payments."
        color="green"
      />
    );
  }

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="Total Paid" value={formatCurrency(data?.summary.totalPaid ?? 0)} color="green" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="Pending" value={formatCurrency(data?.summary.totalPending ?? 0)} color="amber" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="Remaining Balance"
            value={
              data?.summary.remainingBalance != null
                ? formatCurrency(data.summary.remainingBalance)
                : '—'
            }
            color="indigo"
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        {canWrite(PermissionResource.PAYMENTS) && (
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setModalOpen(true)}>
            Record Payment
          </Button>
        )}
      </Box>

      <DataTable<Payment>
        loading={isLoading}
        rows={data?.items ?? []}
        accentColor="green"
        showRowNumbers
        emptyMessage="No payments for this case"
        getRowId={(row) => row.id}
        columns={[
          {
            id: 'amount',
            label: 'Amount',
            render: (row) => formatCurrency(row.amount, row.currency),
          },
          {
            id: 'method',
            label: 'Method',
            render: (row) => String(row.paymentMethod).toUpperCase(),
          },
          {
            id: 'status',
            label: 'Status',
            render: (row) => <PaymentStatusChip status={row.status} />,
          },
          { id: 'paid', label: 'Paid Date', render: (row) => formatDate(row.paidDate) },
          {
            id: 'notes',
            label: 'Notes',
            render: (row) => row.notes ?? '—',
          },
          {
            id: 'actions',
            label: '',
            render: (row) =>
              canWrite(PermissionResource.PAYMENTS) ? (
                <IconButton size="small" onClick={() => deletePayment.mutate(row.id)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              ) : null,
          },
        ]}
      />

      <AddPaymentModal open={modalOpen} onClose={() => setModalOpen(false)} caseId={caseId} />
    </>
  );
}

export default function PaymentsPage() {
  return (
    <RequireAccess resource={PermissionResource.PAYMENTS}>
      <>
      <PageHeader
        title="Payments"
        subtitle="Billing and payment tracking"
        action={<CaseSelect />}
      />
      <Suspense
        fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={32} />
          </Box>
        }
      >
        <PaymentsContent />
      </Suspense>
      </>
    </RequireAccess>
  );
}
