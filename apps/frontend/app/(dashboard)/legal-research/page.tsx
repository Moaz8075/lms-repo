'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import dynamic from 'next/dynamic';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import { PhysicalBookScanModal } from '@/components/modals/PhysicalBookScanModal';
import { LegalNotePrintModal } from '@/components/legal-research/LegalNotePrintModal';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { SearchBar } from '@/components/ui/SearchBar';
import { TablePaginationBar } from '@/components/ui/TablePagination';
import { TagChips } from '@/components/legal-research/TagChips';
import { LegalNoteDetailDialog } from '@/components/legal-research/LegalNoteDetailDialog';
import { AddLibraryItemModal } from '@/components/modals/AddLibraryItemModal';
import { CreateLegalNoteModal } from '@/components/modals/CreateLegalNoteModal';
import { EditLegalNoteModal } from '@/components/modals/EditLegalNoteModal';
import { RequireAccess } from '@/components/auth/RequireAccess';
import { usePermissions } from '@/hooks/usePermissions';
import { useLegalLibrary, useDeleteLibraryItem } from '@/hooks/useLegalLibrary';
import { useLegalNotes, useDeleteLegalNote } from '@/hooks/useLegalNotes';
import { PermissionResource } from '@/types/permissions';
import { formatDate } from '@/utils/format';
import type { LegalNote, LibraryItem } from '@/types';
import type { PdfNoteSelection } from '@/components/legal-research/LibraryPdfViewerDrawer';
import { suggestNoteTitle } from '@/utils/legal-research';

const LibraryPdfViewerDrawer = dynamic(
  () =>
    import('@/components/legal-research/LibraryPdfViewerDrawer').then(
      (mod) => mod.LibraryPdfViewerDrawer,
    ),
  {
    ssr: false,
    loading: () => null,
  },
);

const DEFAULT_LIMIT = 20;

const LIBRARY_CATEGORIES = ['', 'Judgment', 'Book', 'Statute', 'Article'] as const;

interface LibraryPanelProps {
  onBack: () => void;
}

function LibraryPanel({ onBack }: LibraryPanelProps) {
  const { canWrite } = usePermissions();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [addModal, setAddModal] = useState(false);
  const [viewerItem, setViewerItem] = useState<LibraryItem | null>(null);
  const [noteModal, setNoteModal] = useState<{
    item: LibraryItem;
    selection?: PdfNoteSelection;
  } | null>(null);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const { data, isLoading, isError } = useLegalLibrary({
    keyword: search || undefined,
    category: category || undefined,
    page,
    limit,
  });
  const deleteItem = useDeleteLibraryItem();

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ fontWeight: 600, color: 'text.secondary' }}
        >
          Back to Notes
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {LIBRARY_CATEGORIES.map((cat) => (
          <Chip
            key={cat || 'all'}
            label={cat || 'All'}
            onClick={() => setCategory(cat)}
            color={category === cat ? 'primary' : 'default'}
            variant={category === cat ? 'filled' : 'outlined'}
            sx={{ fontWeight: 600 }}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
        <Box sx={{ flex: 1, minWidth: 240, maxWidth: 400 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search library…" />
        </Box>
        {canWrite(PermissionResource.LEGAL_RESEARCH) && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddModal(true)}>
            Add Document
          </Button>
        )}
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <DataTable<LibraryItem>
          loading={isLoading}
          rows={data?.items ?? []}
          accentColor="indigo"
          showRowNumbers
          rowNumberOffset={(page - 1) * limit}
          title="Reference Library"
          totalCount={data?.total}
          emptyMessage={
            isError
              ? 'Unable to load library. Ensure the backend API is running.'
              : 'No documents in the library yet'
          }
          getRowId={(row) => row.id}
          columns={[
            {
              id: 'title',
              label: 'Title',
              render: (row) => (
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {row.title}
                  </Typography>
                  {row.isSystemDocument && (
                    <Chip label="System" size="small" sx={{ mt: 0.5, height: 20, fontSize: 10 }} />
                  )}
                </Box>
              ),
            },
            { id: 'citation', label: 'Citation', render: (row) => row.citation ?? '—' },
            { id: 'court', label: 'Court', render: (row) => row.court ?? '—' },
            { id: 'category', label: 'Category', render: (row) => row.category ?? '—' },
            { id: 'tags', label: 'Tags', render: (row) => <TagChips tags={row.tags} /> },
            {
              id: 'actions',
              label: '',
              render: (row) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title="Read & highlight">
                    <IconButton size="small" onClick={() => setViewerItem(row)}>
                      <MenuBookOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {canWrite(PermissionResource.LEGAL_RESEARCH) && (
                    <Tooltip title="Create note manually">
                      <IconButton
                        size="small"
                        onClick={() => setNoteModal({ item: row })}
                      >
                        <StickyNote2OutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {canWrite(PermissionResource.LEGAL_RESEARCH) && !row.isSystemDocument && (
                    <Tooltip title="Remove">
                      <IconButton size="small" onClick={() => deleteItem.mutate(row.id)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              ),
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

      <AddLibraryItemModal open={addModal} onClose={() => setAddModal(false)} />
      <LibraryPdfViewerDrawer
        open={!!viewerItem}
        item={viewerItem}
        onClose={() => setViewerItem(null)}
        canAddNote={canWrite(PermissionResource.LEGAL_RESEARCH)}
        onAddNote={(selection) => {
          if (!viewerItem) return;
          setNoteModal({ item: viewerItem, selection });
        }}
      />
      <CreateLegalNoteModal
        open={!!noteModal}
        onClose={() => setNoteModal(null)}
        libraryItemId={noteModal?.item.id}
        defaultCitation={noteModal?.item.citation ?? undefined}
        defaultCourt={noteModal?.item.court ?? undefined}
        defaultPageNumber={noteModal?.selection?.pageNumber}
        defaultSelectedText={noteModal?.selection?.selectedText}
        defaultTitle={
          noteModal?.selection
            ? suggestNoteTitle(noteModal.selection.selectedText)
            : undefined
        }
      />
    </>
  );
}

function NotesPanel({ onOpenLibrary }: { onOpenLibrary: () => void }) {
  const { canWrite } = usePermissions();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [createModal, setCreateModal] = useState(false);
  const [scanModal, setScanModal] = useState(false);
  const [editNote, setEditNote] = useState<LegalNote | null>(null);
  const [viewNote, setViewNote] = useState<LegalNote | null>(null);
  const [printNote, setPrintNote] = useState<LegalNote | null>(null);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const { data, isLoading, isError } = useLegalNotes({
    keyword: search || undefined,
    page,
    limit,
  });
  const deleteNote = useDeleteLegalNote();

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
        <Box sx={{ flex: 1, minWidth: 240, maxWidth: 400 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search notes (full-text)…" />
        </Box>
        <Button
          variant="outlined"
          startIcon={<LibraryBooksOutlinedIcon />}
          onClick={onOpenLibrary}
          sx={{ fontWeight: 600 }}
        >
          Browse Library
        </Button>
        {canWrite(PermissionResource.LEGAL_RESEARCH) && (
          <>
            <Button
              variant="outlined"
              startIcon={<DocumentScannerOutlinedIcon />}
              onClick={() => setScanModal(true)}
              sx={{ fontWeight: 600, borderColor: '#0D9488', color: '#0F766E' }}
            >
              Scan book page
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateModal(true)}>
              Create Note
            </Button>
          </>
        )}
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <DataTable<LegalNote>
          loading={isLoading}
          rows={data?.items ?? []}
          accentColor="violet"
          showRowNumbers
          rowNumberOffset={(page - 1) * limit}
          title="My Legal Notes"
          totalCount={data?.total}
          emptyMessage={
            isError
              ? 'Unable to load notes. Ensure the backend API is running.'
              : 'No legal notes yet — browse the library or create a note to get started'
          }
          getRowId={(row) => row.id}
          columns={[
            {
              id: 'title',
              label: 'Title',
              render: (row) => (
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {row.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 280, display: 'block' }}>
                    {row.selectedText.slice(0, 80)}
                    {row.selectedText.length > 80 ? '…' : ''}
                  </Typography>
                </Box>
              ),
            },
            { id: 'page', label: 'Page', render: (row) => row.pageNumber },
            { id: 'citation', label: 'Citation', render: (row) => row.citation ?? '—' },
            {
              id: 'source',
              label: 'Source',
              render: (row) =>
                row.libraryItem?.title ??
                (row.tags.includes('physical-book') ? 'Physical book' : '—'),
            },
            { id: 'tags', label: 'Tags', render: (row) => <TagChips tags={row.tags} /> },
            { id: 'created', label: 'Created', render: (row) => formatDate(row.createdAt) },
            {
              id: 'actions',
              label: '',
              render: (row) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title="View">
                    <IconButton size="small" onClick={() => setViewNote(row)}>
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Print for court">
                    <IconButton size="small" onClick={() => setPrintNote(row)}>
                      <PrintOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {canWrite(PermissionResource.LEGAL_RESEARCH) && (
                    <>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => setEditNote(row)}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => deleteNote.mutate(row.id)}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </Box>
              ),
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

      <CreateLegalNoteModal open={createModal} onClose={() => setCreateModal(false)} />
      <PhysicalBookScanModal open={scanModal} onClose={() => setScanModal(false)} />
      <EditLegalNoteModal
        open={!!editNote}
        onClose={() => setEditNote(null)}
        note={editNote}
      />
      <LegalNotePrintModal
        open={!!printNote}
        onClose={() => setPrintNote(null)}
        note={printNote}
      />
      <LegalNoteDetailDialog
        open={!!viewNote}
        onClose={() => setViewNote(null)}
        note={viewNote}
        onEdit={
          canWrite(PermissionResource.LEGAL_RESEARCH)
            ? () => {
                setEditNote(viewNote);
                setViewNote(null);
              }
            : undefined
        }
      />
    </>
  );
}

export default function LegalResearchPage() {
  const [showLibrary, setShowLibrary] = useState(false);

  return (
    <RequireAccess resource={PermissionResource.LEGAL_RESEARCH}>
      <>
        <PageHeader
          title="Legal Research"
          subtitle={
            showLibrary
              ? 'Browse judgments, statutes, and reference documents'
              : 'Your highlighted legal notes and citations'
          }
        />

        {showLibrary ? (
          <LibraryPanel onBack={() => setShowLibrary(false)} />
        ) : (
          <NotesPanel onOpenLibrary={() => setShowLibrary(true)} />
        )}
      </>
    </RequireAccess>
  );
}
