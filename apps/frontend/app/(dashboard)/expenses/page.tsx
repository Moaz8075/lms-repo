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
import { AddExpenseModal } from '@/components/modals/AddExpenseModal';
import { useSelectedCaseId } from '@/hooks/useCaseSelection';
import { useExpenses, useDeleteExpense } from '@/hooks/useExpenses';
import { RequireAccess } from '@/components/auth/RequireAccess';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionResource } from '@/types/permissions';
import { formatCurrency, formatDate, formatExpenseCategory } from '@/utils/format';
import type { Expense } from '@/types';

function ExpensesContent() {
  const { canWrite } = usePermissions();
  const { caseId } = useSelectedCaseId();
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading } = useExpenses(caseId ? { caseId } : undefined);
  const deleteExpense = useDeleteExpense();

  if (!caseId) {
    return (
      <EmptyState
        title="Select a case"
        message="Choose a case from the dropdown above to view expenses."
        color="rose"
      />
    );
  }

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard
            label="Total Expenses"
            value={formatCurrency(data?.summary.total ?? 0)}
            color="rose"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard label="Expense Count" value={data?.summary.count ?? 0} color="amber" />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        {canWrite(PermissionResource.EXPENSES) && (
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setModalOpen(true)}>
            Add Expense
          </Button>
        )}
      </Box>

      <DataTable<Expense>
        loading={isLoading}
        rows={data?.items ?? []}
        accentColor="rose"
        showRowNumbers
        emptyMessage="No expenses for this case"
        getRowId={(row) => row.id}
        columns={[
          {
            id: 'date',
            label: 'Date',
            render: (row) => formatDate(row.expenseDate),
          },
          {
            id: 'description',
            label: 'Description',
            render: (row) => row.description ?? '—',
          },
          {
            id: 'category',
            label: 'Category',
            render: (row) => formatExpenseCategory(String(row.category)),
          },
          {
            id: 'amount',
            label: 'Amount',
            render: (row) => formatCurrency(row.amount, row.currency),
          },
          {
            id: 'actions',
            label: '',
            render: (row) =>
              canWrite(PermissionResource.EXPENSES) ? (
                <IconButton size="small" onClick={() => deleteExpense.mutate(row.id)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              ) : null,
          },
        ]}
      />

      <AddExpenseModal open={modalOpen} onClose={() => setModalOpen(false)} caseId={caseId} />
    </>
  );
}

export default function ExpensesPage() {
  return (
    <RequireAccess resource={PermissionResource.EXPENSES}>
      <>
      <PageHeader
        title="Expenses"
        subtitle="Case-related expense tracking"
        action={<CaseSelect />}
      />
      <Suspense
        fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={32} />
          </Box>
        }
      >
        <ExpensesContent />
      </Suspense>
      </>
    </RequireAccess>
  );
}
