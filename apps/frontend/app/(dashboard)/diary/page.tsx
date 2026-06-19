import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';

export default function DiaryPage() {
  return (
    <>
      <PageHeader title="Case Diary" subtitle="Chronological roznamcha entries" />
      <DataTable
        columns={[
          { id: 'date', label: 'Date', render: () => '—' },
          { id: 'case', label: 'Case', render: () => '—' },
          { id: 'title', label: 'Title', render: () => '—' },
          { id: 'author', label: 'Author', render: () => '—' },
        ]}
        rows={[]}
        getRowId={() => 'placeholder'}
        emptyMessage="Diary entries will appear here once connected to the API"
      />
    </>
  );
}
