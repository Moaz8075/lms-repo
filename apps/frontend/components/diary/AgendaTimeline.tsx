'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import NextLink from 'next/link';
import GavelIcon from '@mui/icons-material/Gavel';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import { DataTable } from '@/components/ui/DataTable';
import { ACCENT_COLORS } from '@/utils/design-tokens';
import { formatTime } from '@/utils/format';
import type { TimelineItem } from '@/types';

interface AgendaTimelineProps {
  items: TimelineItem[];
  loading?: boolean;
  emptyMessage?: string;
  title?: string;
  accentColor?: 'teal' | 'blue' | 'indigo';
  showCaseLink?: boolean;
}

function TypeChip({ type }: { type: TimelineItem['type'] }) {
  if (type === 'HEARING') {
    return (
      <Chip
        icon={<GavelIcon sx={{ fontSize: '14px !important' }} />}
        label="Hearing"
        size="small"
        sx={{
          bgcolor: ACCENT_COLORS.amber.bg,
          color: ACCENT_COLORS.amber.dark,
          border: `1px solid ${ACCENT_COLORS.amber.border}`,
          fontWeight: 700,
          '& .MuiChip-icon': { color: ACCENT_COLORS.amber.main },
        }}
      />
    );
  }
  return (
    <Chip
      icon={<TaskAltIcon sx={{ fontSize: '14px !important' }} />}
      label="Task"
      size="small"
      sx={{
        bgcolor: ACCENT_COLORS.indigo.bg,
        color: ACCENT_COLORS.indigo.dark,
        border: `1px solid ${ACCENT_COLORS.indigo.border}`,
        fontWeight: 700,
        '& .MuiChip-icon': { color: ACCENT_COLORS.indigo.main },
      }}
    />
  );
}

export function AgendaTimeline({
  items,
  loading,
  emptyMessage = 'Nothing scheduled for this date.',
  title,
  accentColor = 'teal',
  showCaseLink = true,
}: AgendaTimelineProps) {
  return (
    <DataTable<TimelineItem>
      loading={loading}
      rows={items}
      accentColor={accentColor}
      showRowNumbers
      title={title}
      emptyMessage={emptyMessage}
      getRowId={(row) => `${row.type}-${row.id}`}
      columns={[
        {
          id: 'type',
          label: 'Type',
          width: 120,
          render: (row) => <TypeChip type={row.type} />,
        },
        {
          id: 'time',
          label: 'Time',
          width: 90,
          render: (row) =>
            row.time ? (
              <Box
                sx={{
                  display: 'inline-block',
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: ACCENT_COLORS.blue.bg,
                  color: ACCENT_COLORS.blue.dark,
                  fontWeight: 700,
                  fontSize: 13,
                  border: `1px solid ${ACCENT_COLORS.blue.border}`,
                }}
              >
                {formatTime(row.time)}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            ),
        },
        {
          id: 'title',
          label: 'Title',
          render: (row) => (
            <Box>
              <Typography variant="body2" fontWeight={700}>
                {row.title}
              </Typography>
              {showCaseLink && row.caseId && row.caseTitle && (
                <Link
                  component={NextLink}
                  href={`/cases/${row.caseId}`}
                  variant="caption"
                  underline="hover"
                >
                  {row.caseTitle}
                </Link>
              )}
            </Box>
          ),
        },
        {
          id: 'court',
          label: 'Court',
          render: (row) =>
            row.courtName ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <AccountBalanceOutlinedIcon sx={{ fontSize: 16, color: ACCENT_COLORS.teal.main }} />
                <Typography variant="body2" fontWeight={600}>
                  {row.courtName}
                </Typography>
              </Box>
            ) : (
              '—'
            ),
        },
        {
          id: 'description',
          label: 'Description',
          render: (row) => (
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>
              {row.description ?? '—'}
            </Typography>
          ),
        },
        {
          id: 'status',
          label: 'Status',
          width: 120,
          render: (row) => (
            <Chip
              label={row.status.replace(/_/g, ' ')}
              size="small"
              sx={{ fontWeight: 600, fontSize: 11, textTransform: 'capitalize' }}
            />
          ),
        },
      ]}
    />
  );
}
