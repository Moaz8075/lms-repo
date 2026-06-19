'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { PaymentStatusChip } from '@/components/ui/StatusChip';
import { usePayments } from '@/hooks/usePayments';
import { formatCurrency, formatDate } from '@/utils/format';
import type { Payment } from '@/types';

export default function PaymentsPage() {
  const { data, isLoading, isError } = usePayments();

  return (
    <>
      <PageHeader title="Payments" subtitle="Billing and payment tracking" />
      <DataTable<Payment>
        loading={isLoading}
        rows={data?.items ?? []}
        emptyMessage={
          isError
            ? 'Unable to load payments. Ensure the backend API is running.'
            : 'No payments found'
        }
        getRowId={(row) => row.id}
        columns={[
          { id: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount, row.currency) },
          {
            id: 'status',
            label: 'Status',
            render: (row) => <PaymentStatusChip status={row.status} />,
          },
          { id: 'due', label: 'Due Date', render: (row) => formatDate(row.dueDate) },
          { id: 'paid', label: 'Paid Date', render: (row) => formatDate(row.paidDate) },
        ]}
      />
    </>
  );
}
