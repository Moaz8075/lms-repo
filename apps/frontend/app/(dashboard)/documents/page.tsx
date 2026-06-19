import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';

export default function DocumentsPage() {
  return (
    <>
      <PageHeader title="Documents" subtitle="Legal files and case documents" />
      <DataTable
        columns={[
          { id: 'name', label: 'File Name', render: () => '—' },
          { id: 'case', label: 'Case', render: () => '—' },
          { id: 'type', label: 'Type', render: () => '—' },
          { id: 'uploaded', label: 'Uploaded', render: () => '—' },
        ]}
        rows={[]}
        getRowId={() => 'placeholder'}
        emptyMessage="Documents will appear here once connected to the API"
      />
    </>
  );
}
