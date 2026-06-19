import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';

export default function ExpensesPage() {
  return (
    <>
      <PageHeader title="Expenses" subtitle="Case-related expense tracking" />
      <DataTable
        columns={[
          { id: 'date', label: 'Date', render: () => '—' },
          { id: 'case', label: 'Case', render: () => '—' },
          { id: 'category', label: 'Category', render: () => '—' },
          { id: 'amount', label: 'Amount', render: () => '—' },
        ]}
        rows={[]}
        getRowId={() => 'placeholder'}
        emptyMessage="Expenses will appear here once connected to the API"
      />
    </>
  );
}
