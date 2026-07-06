'use client';

import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LinkIcon from '@mui/icons-material/Link';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import { TagChips } from '@/components/legal-research/TagChips';
import { LegalNotePrintModal } from '@/components/legal-research/LegalNotePrintModal';
import { formatDate, formatFullName } from '@/utils/format';
import type { Case, LegalNote } from '@/types';
import { ACCENT_COLORS } from '@/utils/design-tokens';

interface LegalNoteDetailDialogProps {
  open: boolean;
  onClose: () => void;
  note: LegalNote | null;
  caseData?: Case | null;
  onEdit?: () => void;
  onAttachToCase?: () => void;
  showAttachAction?: boolean;
}

export function LegalNoteDetailDialog({
  open,
  onClose,
  note,
  caseData,
  onEdit,
  onAttachToCase,
  showAttachAction,
}: LegalNoteDetailDialogProps) {
  const [printOpen, setPrintOpen] = useState(false);

  if (!note) return null;

  const c = ACCENT_COLORS.violet;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box
        sx={{
          background: `linear-gradient(135deg, ${c.light} 0%, ${c.bg} 100%)`,
          borderBottom: `1px solid ${c.border}`,
          px: 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: c.dark }}>
            {note.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Page {note.pageNumber}
            {note.citation ? ` · ${note.citation}` : ''}
            {note.court ? ` · ${note.court}` : ''}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ bgcolor: '#fff', border: `1px solid ${c.border}` }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ bgcolor: '#FAFCFF', pt: 3 }}>
        <Stack spacing={2.5}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: '#fff',
              border: '1px solid #E5E7EB',
              borderLeft: `4px solid ${c.main}`,
            }}
          >
            <Typography variant="overline" color="text.secondary" fontWeight={700}>
              Highlighted Text
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.75, fontStyle: 'italic' }}>
              &ldquo;{note.selectedText}&rdquo;
            </Typography>
          </Box>

          {note.personalNote && (
            <Box>
              <Typography variant="overline" color="text.secondary" fontWeight={700}>
                Personal Note
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.7 }}>
                {note.personalNote}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Tags
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <TagChips tags={note.tags} max={10} />
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Created By
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {formatFullName(note.createdBy.firstName, note.createdBy.lastName)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Created
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {formatDate(note.createdAt)}
              </Typography>
            </Box>
          </Box>

          {note.libraryItem && (
            <>
              <Divider />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Source Document
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {note.libraryItem.title}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<OpenInNewIcon />}
                  href={note.libraryItem.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open PDF
                </Button>
              </Box>
            </>
          )}

          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ pt: 1 }}>
            <Button
              variant="outlined"
              startIcon={<PrintOutlinedIcon />}
              onClick={() => setPrintOpen(true)}
            >
              Print for Court
            </Button>
            {showAttachAction && onAttachToCase && (
              <Button variant="outlined" startIcon={<LinkIcon />} onClick={onAttachToCase}>
                Attach to Case
              </Button>
            )}
            {onEdit && (
              <Button variant="contained" onClick={onEdit} sx={{ bgcolor: c.main, '&:hover': { bgcolor: c.dark } }}>
                Edit Note
              </Button>
            )}
          </Stack>
        </Stack>
      </DialogContent>

      <LegalNotePrintModal
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        note={note}
        caseData={caseData}
      />
    </Dialog>
  );
}
