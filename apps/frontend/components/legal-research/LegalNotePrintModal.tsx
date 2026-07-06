'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CloseIcon from '@mui/icons-material/Close';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import { LegalNotePrintSheet } from '@/components/legal-research/LegalNotePrintSheet';
import { useAuth } from '@/hooks/useAuth';
import { useCases, useCase } from '@/hooks/useCases';
import type { Case, LegalNote } from '@/types';
import {
  buildLegalNotePrintData,
  getDefaultLawyerName,
  printLegalNoteSheet,
} from '@/utils/legal-note-print';
import { ACCENT_COLORS } from '@/utils/design-tokens';

interface LegalNotePrintModalProps {
  open: boolean;
  onClose: () => void;
  note: LegalNote | null;
  caseData?: Case | null;
}

export function LegalNotePrintModal({
  open,
  onClose,
  note,
  caseData: initialCaseData,
}: LegalNotePrintModalProps) {
  const { user, organization } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);
  const { data: casesData } = useCases({ limit: 100 });
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [lawyerName, setLawyerName] = useState('');

  const { data: selectedCase } = useCase(selectedCaseId);

  useEffect(() => {
    if (!open) return;
    setSelectedCaseId(initialCaseData?.id ?? '');
    setLawyerName(getDefaultLawyerName(user));
  }, [open, initialCaseData?.id, user]);

  const resolvedCase = initialCaseData ?? selectedCase ?? null;

  const printData = useMemo(() => {
    if (!note || !organization) return null;
    return buildLegalNotePrintData({
      note,
      organizationName: organization.name,
      organizationAddress: organization.address,
      organizationPhone: organization.phone,
      lawyerName: lawyerName.trim() || getDefaultLawyerName(user),
      caseData: resolvedCase,
    });
  }, [note, organization, lawyerName, user, resolvedCase]);

  if (!note || !printData) return null;

  const c = ACCENT_COLORS.indigo;

  const handlePrint = () => {
    const sheet = printRef.current?.querySelector('.legal-note-print-sheet');
    if (!sheet || !(sheet instanceof HTMLElement)) return;
    printLegalNoteSheet(sheet, `Legal Note — ${note.title}`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: c.dark }}>
            Print for Court Filing
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Review the formatted memorandum before printing or saving as PDF
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ bgcolor: '#fff', border: `1px solid ${c.border}` }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ bgcolor: '#F3F4F6', pt: 3 }}>
        <Stack spacing={2} sx={{ mb: 2 }}>
          {!initialCaseData && (
            <TextField
              select
              label="Case reference"
              fullWidth
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              helperText="Optional — include case details on the printed memorandum"
            >
              <MenuItem value="">None</MenuItem>
              {(casesData?.items ?? []).map((caseItem) => (
                <MenuItem key={caseItem.id} value={caseItem.id}>
                  {caseItem.caseNumber} — {caseItem.title}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            label="Lawyer name (for signature)"
            fullWidth
            value={lawyerName}
            onChange={(e) => setLawyerName(e.target.value)}
            helperText="Printed above the signature line at the end of the document"
          />
        </Stack>

        <Box
          ref={printRef}
          sx={{
            bgcolor: '#fff',
            borderRadius: 2,
            border: '1px solid #E5E7EB',
            p: { xs: 2, sm: 3 },
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
            '& .legal-note-print-sheet': {
              fontFamily: '"Times New Roman", Times, serif',
              color: '#111827',
            },
            '& .print-header': {
              textAlign: 'center',
              borderBottom: '2px solid #111827',
              pb: 1.75,
              mb: 2.25,
            },
            '& .print-org-name': {
              fontSize: '1.35rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              m: 0,
            },
            '& .print-org-meta': {
              fontSize: '0.8rem',
              color: '#4b5563',
              m: 0,
              mt: 0.5,
            },
            '& .print-title-block': {
              textAlign: 'center',
              my: 2,
            },
            '& .print-doc-title': {
              fontSize: '1.05rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              m: 0,
            },
            '& .print-doc-subtitle': {
              fontSize: '0.8rem',
              color: '#4b5563',
              m: 0,
              mt: 0.5,
            },
            '& .print-section': {
              mb: 2.25,
            },
            '& .print-section-title': {
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#1f2937',
              borderBottom: '1px solid #d1d5db',
              pb: 0.5,
              mb: 1.25,
            },
            '& .print-grid': {
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '140px 1fr' },
              gap: '6px 12px',
            },
            '& .print-label': {
              fontWeight: 600,
              color: '#374151',
            },
            '& .print-value': {
              m: 0,
            },
            '& .print-excerpt-box': {
              border: '1px solid #d1d5db',
              borderLeft: '4px solid #1f2937',
              p: 1.75,
              bgcolor: '#f9fafb',
              mt: 1,
            },
            '& .print-excerpt-text': {
              m: 0,
              fontStyle: 'italic',
              whiteSpace: 'pre-wrap',
            },
            '& .print-remarks': {
              mt: 1,
              whiteSpace: 'pre-wrap',
            },
            '& .print-footer': {
              mt: 3,
            },
            '& .print-prepared': {
              fontSize: '0.8rem',
              color: '#4b5563',
              mb: 3,
            },
            '& .print-signature-block': {
              width: 280,
              ml: 'auto',
              textAlign: 'center',
            },
            '& .print-signature-line': {
              borderTop: '1px solid #111827',
              mt: 5,
              mb: 1,
            },
            '& .print-signature-name': {
              fontWeight: 700,
              m: 0,
            },
            '& .print-signature-role': {
              m: 0,
              mt: 0.25,
              fontSize: '0.8rem',
              color: '#4b5563',
            },
            '& .print-signature-label': {
              m: 0,
              mt: 0.75,
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#6b7280',
            },
          }}
        >

          <LegalNotePrintSheet data={printData} />
        </Box>

        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintOutlinedIcon />}
            onClick={handlePrint}
            sx={{ bgcolor: c.main, '&:hover': { bgcolor: c.dark } }}
          >
            Print / Save as PDF
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
