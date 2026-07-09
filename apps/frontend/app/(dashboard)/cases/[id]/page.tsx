'use client';

import { use, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import EventIcon from '@mui/icons-material/Event';
import FolderIcon from '@mui/icons-material/Folder';
import PaymentsIcon from '@mui/icons-material/Payments';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Paper from '@mui/material/Paper';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { InfoCard } from '@/components/ui/InfoCard';
import {
  CaseStatusChip,
  CaseTypeChip,
  PaymentStatusChip,
  PaymentMethodChip,
} from '@/components/ui/StatusChip';
import { AddHearingModal } from '@/components/modals/AddHearingModal';
import { UploadDocumentModal } from '@/components/modals/UploadDocumentModal';
import { AddPaymentModal } from '@/components/modals/AddPaymentModal';
import { AddExpenseModal } from '@/components/modals/AddExpenseModal';
import { AttachReferenceModal } from '@/components/modals/AttachReferenceModal';
import { LegalNoteDetailDialog } from '@/components/legal-research/LegalNoteDetailDialog';
import { LegalNotePrintModal } from '@/components/legal-research/LegalNotePrintModal';
import { TagChips } from '@/components/legal-research/TagChips';
import { AgendaTimeline } from '@/components/diary/AgendaTimeline';
import { UpcomingAgenda } from '@/components/diary/UpcomingAgenda';
import { useCase } from '@/hooks/useCases';
import { useHearings } from '@/hooks/useHearings';
import { useDailyDiary, useUpcomingDiary } from '@/hooks/useDiary';
import { useDocuments, useDeleteDocument } from '@/hooks/useDocuments';
import { usePayments, useDeletePayment } from '@/hooks/usePayments';
import { useExpenses, useDeleteExpense } from '@/hooks/useExpenses';
import { useCaseReferences, useDetachCaseReference } from '@/hooks/useCaseReferences';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionResource } from '@/types/permissions';
import { StatCard } from '@/components/ui/StatCard';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatExpenseCategory,
  formatFileSize,
  formatTime,
  formatFullName,
  toDateInputValue,
} from '@/utils/format';
import type { CaseReference, Document, Expense, Hearing, LegalNote, Payment } from '@/types';

const BASE_TABS = ['Overview', 'Hearings', 'Agenda', 'Documents', 'Payments', 'Expenses'] as const;

interface CaseDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function CaseDetailsPage({ params }: CaseDetailsPageProps) {
  const { id } = use(params);
  const { canView, canWrite } = usePermissions();
  const { data: caseData, isLoading, isError } = useCase(id);
  const [tab, setTab] = useState(0);
  const [hearingModal, setHearingModal] = useState(false);
  const [documentModal, setDocumentModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);
  const [referenceModal, setReferenceModal] = useState(false);
  const [viewReferenceNote, setViewReferenceNote] = useState<LegalNote | null>(null);
  const [printReferenceNote, setPrintReferenceNote] = useState<LegalNote | null>(null);

  const caseParams = { caseId: id };
  const { data: hearingsData, isLoading: hearingsLoading } = useHearings(caseParams);
  const { data: dailyAgenda, isLoading: agendaLoading } = useDailyDiary(toDateInputValue(), id);
  const { data: upcomingAgenda, isLoading: upcomingLoading } = useUpcomingDiary(id);
  const { data: documentsData, isLoading: documentsLoading } = useDocuments(caseParams);
  const { data: paymentsData, isLoading: paymentsLoading } = usePayments(caseParams);
  const { data: expensesData, isLoading: expensesLoading } = useExpenses(caseParams);
  const { data: referencesData, isLoading: referencesLoading } = useCaseReferences(
    canView(PermissionResource.LEGAL_RESEARCH) ? id : undefined,
  );
  const deleteDocument = useDeleteDocument();
  const deletePayment = useDeletePayment();
  const deleteExpense = useDeleteExpense();
  const detachReference = useDetachCaseReference(id);

  const tabs = canView(PermissionResource.LEGAL_RESEARCH)
    ? [...BASE_TABS, 'References']
    : [...BASE_TABS];
  const referencesTabIndex = tabs.indexOf('References');

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={300} height={40} />
        <Skeleton variant="rectangular" height={200} sx={{ mt: 2, borderRadius: 2 }} />
      </Box>
    );
  }

  if (isError || !caseData) {
    return (
      <PageHeader
        title="Case Details"
        subtitle="Unable to load case. Ensure the backend API is running."
      />
    );
  }

  return (
    <>
      <PageHeader
        title={caseData.title}
        subtitle={`Case #${caseData.caseNumber}`}
        action={<CaseStatusChip status={caseData.status} />}
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <InfoCard label="Client" value={caseData.client?.name ?? '—'} icon={<PersonOutlineIcon />} color="blue" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <InfoCard label="Court" value={caseData.courtName ?? '—'} icon={<AccountBalanceOutlinedIcon />} color="indigo" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <InfoCard label="Next Hearing" value={formatDate(caseData.nextHearingDate)} icon={<EventOutlinedIcon />} color="amber" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <InfoCard
            label="Case Type"
            value={<CaseTypeChip caseType={caseData.caseType} />}
            icon={<CategoryOutlinedIcon />}
            color="violet"
          />
        </Grid>
      </Grid>

      <Paper sx={{ mb: 2, bgcolor: '#FAFCFF', border: '1px solid #E8F0FE' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            px: 1,
            '& .MuiTab-root': { minHeight: 52 },
            '& .Mui-selected': { color: 'primary.main' },
          }}
          TabIndicatorProps={{ sx: { height: 3, borderRadius: 2, bgcolor: '#1A73E8' } }}
        >
          {tabs.map((label) => (
            <Tab key={label} label={label} />
          ))}
        </Tabs>
      </Paper>

      {tab === 0 && (
        <Card sx={{ bgcolor: '#FAFCFF', border: '1px solid #E8F0FE' }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom fontWeight={700} sx={{ color: '#1557B0' }}>
              Description
            </Typography>
            <Typography color="text.secondary" mb={3}>
              {caseData.description ?? 'No description provided.'}
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard label="Hearings" value={caseData.hearingsCount} icon={<EventIcon />} color="amber" />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard label="Documents" value={caseData.documentsCount} icon={<FolderIcon />} color="cyan" />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard label="Payments" value={caseData.paymentsSummary.count} icon={<PaymentsIcon />} color="green" />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard
                  label="Paid Amount"
                  value={formatCurrency(caseData.paymentsSummary.paid)}
                  icon={<ReceiptIcon />}
                  color="indigo"
                />
              </Grid>
            </Grid>
            {caseData.opposingParty && (
              <Box mt={3} sx={{ p: 2, bgcolor: '#FCE8E6', borderRadius: 2, border: '1px solid #F5C6C2' }}>
                <Typography variant="body2" sx={{ color: '#B91C1C', fontWeight: 700 }}>
                  Opposing Party
                </Typography>
                <Typography fontWeight={600}>{caseData.opposingParty}</Typography>
                {caseData.opposingLawyer && (
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    Counsel: {caseData.opposingLawyer}
                  </Typography>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => setHearingModal(true)}
              sx={{ bgcolor: '#F59E0B', '&:hover': { bgcolor: '#B45309' } }}
            >
              Add Hearing
            </Button>
          </Box>
          <DataTable<Hearing>
            loading={hearingsLoading}
            rows={hearingsData?.items ?? []}
            accentColor="amber"
            showRowNumbers
            emptyMessage="No hearings scheduled for this case"
            getRowId={(row) => row.id}
            columns={[
              {
                id: 'date',
                label: 'Date',
                render: (row) => formatDate(row.hearingDate),
              },
              { id: 'time', label: 'Time', render: (row) => formatTime(row.time) },
              { id: 'courtRoom', label: 'Court Room', render: (row) => row.courtRoom ?? '—' },
              { id: 'purpose', label: 'Purpose', render: (row) => row.purpose ?? '—' },
            ]}
          />
        </>
      )}

      {tab === 2 && (
        <>
          <AgendaTimeline
            items={dailyAgenda?.combinedTimeline ?? []}
            loading={agendaLoading}
            title="Today's agenda for this case"
            emptyMessage="No hearings or tasks scheduled for today."
            showCaseLink={false}
            accentColor="teal"
          />
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Upcoming
            </Typography>
            <UpcomingAgenda groups={upcomingAgenda?.groups ?? []} loading={upcomingLoading} />
          </Box>
        </>
      )}

      {tab === 3 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => setDocumentModal(true)}
              sx={{ bgcolor: '#0891B2', '&:hover': { bgcolor: '#0E7490' } }}
            >
              Upload Document
            </Button>
          </Box>
          <DataTable<Document>
            loading={documentsLoading}
            rows={documentsData?.items ?? []}
            accentColor="cyan"
            showRowNumbers
            emptyMessage="No documents uploaded for this case"
            getRowId={(row) => row.id}
            columns={[
              { id: 'fileName', label: 'File Name', render: (row) => row.fileName },
              { id: 'type', label: 'Type', render: (row) => row.fileType },
              { id: 'category', label: 'Category', render: (row) => row.category ?? '—' },
              { id: 'size', label: 'Size', render: (row) => formatFileSize(row.fileSize) },
              {
                id: 'uploaded',
                label: 'Uploaded',
                render: (row) => formatDateTime(row.createdAt),
              },
              {
                id: 'actions',
                label: '',
                render: (row) => (
                  <Box>
                    <IconButton
                      size="small"
                      component="a"
                      href={row.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => deleteDocument.mutate(row.id)}
                      aria-label="delete document"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ),
              },
            ]}
          />
        </>
      )}

      {tab === 4 && (
        <>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard
                label="Total Paid"
                value={formatCurrency(paymentsData?.summary.totalPaid ?? 0)}
                color="green"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard
                label="Pending"
                value={formatCurrency(paymentsData?.summary.totalPending ?? 0)}
                color="amber"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard
                label="Remaining"
                value={
                  paymentsData?.summary.remainingBalance != null
                    ? formatCurrency(paymentsData.summary.remainingBalance)
                    : '—'
                }
                color="indigo"
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button startIcon={<AddIcon />} variant="contained" onClick={() => setPaymentModal(true)}>
              Record Payment
            </Button>
          </Box>
          <DataTable<Payment>
            loading={paymentsLoading}
            rows={paymentsData?.items ?? []}
            accentColor="green"
            showRowNumbers
            emptyMessage="No payments recorded for this case"
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
                render: (row) => <PaymentMethodChip method={String(row.paymentMethod)} />,
              },
              {
                id: 'status',
                label: 'Status',
                render: (row) => <PaymentStatusChip status={row.status} />,
              },
              { id: 'paid', label: 'Paid Date', render: (row) => formatDate(row.paidDate) },
              {
                id: 'actions',
                label: '',
                render: (row) => (
                  <IconButton
                    size="small"
                    onClick={() => deletePayment.mutate(row.id)}
                    aria-label="delete payment"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                ),
              },
            ]}
          />
        </>
      )}

      {tab === 5 && (
        <>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <StatCard
                label="Total Expenses"
                value={formatCurrency(expensesData?.summary.total ?? 0)}
                color="rose"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <StatCard
                label="Expense Count"
                value={expensesData?.summary.count ?? 0}
                color="amber"
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button startIcon={<AddIcon />} variant="contained" onClick={() => setExpenseModal(true)}>
              Add Expense
            </Button>
          </Box>
          <DataTable<Expense>
            loading={expensesLoading}
            rows={expensesData?.items ?? []}
            accentColor="rose"
            showRowNumbers
            emptyMessage="No expenses recorded for this case"
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
                render: (row) => (
                  <IconButton
                    size="small"
                    onClick={() => deleteExpense.mutate(row.id)}
                    aria-label="delete expense"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                ),
              },
            ]}
          />
        </>
      )}

      {tab === referencesTabIndex && referencesTabIndex >= 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            {canWrite(PermissionResource.LEGAL_RESEARCH) && (
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={() => setReferenceModal(true)}
                sx={{ bgcolor: '#4F46E5', '&:hover': { bgcolor: '#3730A3' } }}
              >
                Attach Legal Note
              </Button>
            )}
          </Box>
          <DataTable<CaseReference>
            loading={referencesLoading}
            rows={referencesData ?? []}
            accentColor="indigo"
            showRowNumbers
            emptyMessage="No legal references attached to this case yet"
            getRowId={(row) => row.id}
            columns={[
              {
                id: 'title',
                label: 'Note Title',
                render: (row) => row.legalNote.title,
              },
              {
                id: 'excerpt',
                label: 'Highlighted Text',
                render: (row) =>
                  row.legalNote.selectedText.length > 80
                    ? `${row.legalNote.selectedText.slice(0, 80)}…`
                    : row.legalNote.selectedText,
              },
              {
                id: 'citation',
                label: 'Citation',
                render: (row) => row.legalNote.citation ?? '—',
              },
              {
                id: 'tags',
                label: 'Tags',
                render: (row) => <TagChips tags={row.legalNote.tags} />,
              },
              {
                id: 'attached',
                label: 'Attached',
                render: (row) => formatDate(row.attachedAt),
              },
              {
                id: 'by',
                label: 'By',
                render: (row) =>
                  formatFullName(row.attachedBy.firstName, row.attachedBy.lastName),
              },
              {
                id: 'actions',
                label: '',
                render: (row) => (
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => setViewReferenceNote(row.legalNote)}
                      aria-label="view note"
                    >
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setPrintReferenceNote(row.legalNote)}
                      aria-label="print note"
                    >
                      <PrintOutlinedIcon fontSize="small" />
                    </IconButton>
                    {canWrite(PermissionResource.LEGAL_RESEARCH) && (
                      <IconButton
                        size="small"
                        onClick={() => detachReference.mutate(row.id)}
                        aria-label="detach reference"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ),
              },
            ]}
          />
        </>
      )}

      <AddHearingModal open={hearingModal} onClose={() => setHearingModal(false)} caseId={id} />
      <UploadDocumentModal open={documentModal} onClose={() => setDocumentModal(false)} caseId={id} />
      <AddPaymentModal open={paymentModal} onClose={() => setPaymentModal(false)} caseId={id} />
      <AddExpenseModal open={expenseModal} onClose={() => setExpenseModal(false)} caseId={id} />
      <AttachReferenceModal
        open={referenceModal}
        onClose={() => setReferenceModal(false)}
        caseId={id}
      />
        <LegalNotePrintModal
        open={!!printReferenceNote}
        onClose={() => setPrintReferenceNote(null)}
        note={printReferenceNote}
        caseData={caseData ?? null}
      />
      <LegalNoteDetailDialog
        open={!!viewReferenceNote}
        onClose={() => setViewReferenceNote(null)}
        note={viewReferenceNote}
        caseData={caseData}
      />
    </>
  );
}
