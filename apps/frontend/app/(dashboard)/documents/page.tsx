'use client';

import { Suspense, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { PageHeader } from '@/components/ui/PageHeader';
import { CaseSelect } from '@/components/ui/CaseSelect';
import { EmptyState } from '@/components/ui/EmptyState';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { UploadDocumentModal } from '@/components/modals/UploadDocumentModal';
import { useSelectedCaseId } from '@/hooks/useCaseSelection';
import { useDocuments, useDeleteDocument } from '@/hooks/useDocuments';
import { formatDateTime, formatFileSize } from '@/utils/format';

function DocumentsContent() {
  const { caseId } = useSelectedCaseId();
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading } = useDocuments(caseId ? { caseId } : undefined);
  const deleteDocument = useDeleteDocument();

  if (!caseId) {
    return (
      <EmptyState
        title="Select a case"
        message="Choose a case from the dropdown above to view documents."
      />
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const documents = data?.items ?? [];

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setModalOpen(true)}>
          Upload Document
        </Button>
      </Box>

      {documents.length === 0 ? (
        <EmptyState title="No documents" message="Upload documents for this case." />
      ) : (
        <Grid container spacing={2}>
          {documents.map((doc) => (
            <Grid key={doc.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <InsertDriveFileOutlinedIcon color="primary" />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" noWrap>
                        {doc.fileName}
                      </Typography>
                      <MonoLabel>{doc.fileType}</MonoLabel>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {formatFileSize(doc.fileSize)} · {formatDateTime(doc.createdAt)}
                      </Typography>
                      {doc.category && (
                        <Typography variant="caption" color="text.secondary">
                          {doc.category}
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        component="a"
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => deleteDocument.mutate(doc.id)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <UploadDocumentModal open={modalOpen} onClose={() => setModalOpen(false)} caseId={caseId} />
    </>
  );
}

export default function DocumentsPage() {
  return (
    <>
      <PageHeader
        title="Documents"
        subtitle="Legal files and case documents"
        action={<CaseSelect />}
      />
      <Suspense
        fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={32} />
          </Box>
        }
      >
        <DocumentsContent />
      </Suspense>
    </>
  );
}
