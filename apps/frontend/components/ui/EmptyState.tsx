import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import type { ReactNode } from 'react';
import { ACCENT_COLORS, type AccentColor } from '@/utils/design-tokens';

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
  icon?: ReactNode;
  color?: AccentColor;
}

export function EmptyState({
  title = 'No records found',
  message = 'There is nothing to display yet.',
  action,
  icon,
  color = 'blue',
}: EmptyStateProps) {
  const c = ACCENT_COLORS[color];

  return (
    <Paper
      sx={{
        p: 5,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        bgcolor: c.light,
        border: `1px dashed ${c.border}`,
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          bgcolor: c.bg,
          color: c.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `2px solid ${c.border}`,
          '& .MuiSvgIcon-root': { fontSize: 36 },
        }}
      >
        {icon ?? <InboxOutlinedIcon />}
      </Box>
      <Typography variant="subtitle1" fontWeight={700} sx={{ color: c.dark }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" maxWidth={360}>
        {message}
      </Typography>
      {action && <Box mt={1}>{action}</Box>}
    </Paper>
  );
}
