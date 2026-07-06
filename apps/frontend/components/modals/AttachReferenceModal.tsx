'use client';

import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import { useLegalNotes } from '@/hooks/useLegalNotes';
import { useAttachCaseReference } from '@/hooks/useCaseReferences';
import { ACCENT_COLORS } from '@/utils/design-tokens';

interface AttachReferenceModalProps {
  open: boolean;
  onClose: () => void;
  caseId: string;
}

export function AttachReferenceModal({ open, onClose, caseId }: AttachReferenceModalProps) {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useLegalNotes({
    keyword: search || undefined,
    page: 1,
    limit: 50,
  });
  const attachReference = useAttachCaseReference(caseId);
  const c = ACCENT_COLORS.indigo;

  useEffect(() => {
    if (!open) setSearch('');
  }, [open]);

  const handleAttach = async (legalNoteId: string) => {
    await attachReference.mutateAsync({ legalNoteId });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box
        sx={{
          background: `linear-gradient(135deg, ${c.light} 0%, ${c.bg} 100%)`,
          borderBottom: `1px solid ${c.border}`,
          px: 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2.5,
            bgcolor: '#fff',
            color: c.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${c.border}`,
          }}
        >
          <LinkIcon />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: c.dark }}>
            Attach Legal Note
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Select a note from your research library
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ bgcolor: '#fff', border: `1px solid ${c.border}` }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ bgcolor: '#FAFCFF', pt: 2.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search notes by keyword…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />

        {attachReference.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to attach note. It may already be linked to this case.
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <List disablePadding sx={{ maxHeight: 360, overflow: 'auto' }}>
            {(data?.items ?? []).length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                No notes found. Create notes in Legal Research first.
              </Typography>
            ) : (
              data!.items.map((note) => (
                <ListItemButton
                  key={note.id}
                  onClick={() => handleAttach(note.id)}
                  disabled={attachReference.isPending}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: '#fff',
                  }}
                >
                  <ListItemText
                    primary={note.title}
                    secondary={
                      note.selectedText.length > 100
                        ? `${note.selectedText.slice(0, 100)}…`
                        : note.selectedText
                    }
                    primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                    secondaryTypographyProps={{ fontSize: 12, noWrap: true }}
                  />
                </ListItemButton>
              ))
            )}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}
