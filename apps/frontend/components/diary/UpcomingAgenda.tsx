'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import GavelIcon from '@mui/icons-material/Gavel';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { ACCENT_COLORS } from '@/utils/design-tokens';
import { formatTime } from '@/utils/format';
import type { UpcomingDateGroup } from '@/types';

interface UpcomingAgendaProps {
  groups: UpcomingDateGroup[];
  loading?: boolean;
}

export function UpcomingAgenda({ groups, loading }: UpcomingAgendaProps) {
  const c = ACCENT_COLORS.indigo;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={28} sx={{ color: c.main }} />
      </Box>
    );
  }

  if (groups.length === 0) {
    return (
      <Paper sx={{ p: 3, bgcolor: c.light, border: `1px dashed ${c.border}`, borderRadius: 3 }}>
        <Typography color="text.secondary" textAlign="center">
          No upcoming hearings or tasks in the next 30 days.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {groups.map((group) => (
        <Paper
          key={group.date}
          sx={{
            overflow: 'hidden',
            border: `1px solid ${c.border}`,
            borderRadius: 3,
          }}
        >
          <Box sx={{ px: 2.5, py: 1.5, bgcolor: c.bg, borderBottom: `1px solid ${c.border}` }}>
            <Typography variant="subtitle2" fontWeight={800} sx={{ color: c.dark }}>
              {group.label}
            </Typography>
          </Box>
          <List dense disablePadding>
            {group.items.map((item) => (
              <ListItem
                key={`${item.type}-${item.id}`}
                divider
                sx={{
                  py: 1.25,
                  '&:hover': { bgcolor: c.light },
                }}
              >
                <Box sx={{ mr: 1.5, color: item.type === 'HEARING' ? ACCENT_COLORS.amber.main : c.main }}>
                  {item.type === 'HEARING' ? (
                    <GavelIcon fontSize="small" />
                  ) : (
                    <TaskAltIcon fontSize="small" />
                  )}
                </Box>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={700}>
                      {item.caseTitle ? `${item.caseTitle}` : item.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {item.title}
                      {item.time ? ` · ${formatTime(item.time)}` : ''}
                      {item.courtName ? ` · ${item.courtName}` : ''}
                    </Typography>
                  }
                />
                <Chip
                  label={item.type}
                  size="small"
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    bgcolor: item.type === 'HEARING' ? ACCENT_COLORS.amber.bg : c.bg,
                    color: item.type === 'HEARING' ? ACCENT_COLORS.amber.dark : c.dark,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      ))}
    </Box>
  );
}
