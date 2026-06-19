import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';

export default function HearingsPage() {
  return (
    <>
      <PageHeader title="Hearings" subtitle="Upcoming and past court hearings" />
      <DataTable
        columns={[
          { id: 'case', label: 'Case', render: () => '—' },
          { id: 'date', label: 'Scheduled Date', render: () => '—' },
          { id: 'court', label: 'Court Room', render: () => '—' },
          { id: 'outcome', label: 'Outcome', render: () => '—' },
        ]}
        rows={[]}
        getRowId={() => 'placeholder'}
        emptyMessage="Hearings will appear here once connected to the API"
      />
    </>
  );
}
