'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import type { ReactNode } from 'react';
import { ACCENT_COLORS, type AccentColor } from '@/utils/design-tokens';

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit: () => void;
  submitLabel?: string;
  loading?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
  accent?: AccentColor;
  icon?: ReactNode;
}

export function FormDialog({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = 'Save',
  loading = false,
  maxWidth = 'sm',
  accent = 'blue',
  icon,
}: FormDialogProps) {
  const c = ACCENT_COLORS[accent];

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth={maxWidth} fullWidth>
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
        {icon && (
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
              boxShadow: `0 2px 8px ${c.main}22`,
              flexShrink: 0,
              '& .MuiSvgIcon-root': { fontSize: 24 },
            }}
          >
            {icon}
          </Box>
        )}
        <Typography variant="h6" fontWeight={700} sx={{ color: c.dark, flex: 1 }}>
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          disabled={loading}
          size="small"
          sx={{ color: c.dark, bgcolor: '#fff', border: `1px solid ${c.border}` }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 3, pb: 2, px: 3, bgcolor: '#FAFCFF' }}>
        {children}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          bgcolor: '#fff',
          borderTop: '1px solid',
          borderColor: 'divider',
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ color: 'text.secondary', fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
          sx={{
            bgcolor: c.main,
            px: 3,
            '&:hover': { bgcolor: c.dark },
            boxShadow: `0 2px 8px ${c.main}44`,
          }}
        >
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
