'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import NextLink from 'next/link';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { DataTable } from '@/components/ui/DataTable';
import { ACCENT_COLORS } from '@/utils/design-tokens';
import { formatTime } from '@/utils/format';
import type { TimelineItem } from '@/types';

interface DiaryTasksSectionProps {
  tasks: TimelineItem[];
  loading?: boolean;
}

function taskTypeLabel(status: string): string {
  return status.replace(/_/g, ' ');
}

export function DiaryTasksSection({ tasks, loading }: DiaryTasksSectionProps) {
  if (!loading && tasks.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          mb: 2,
          px: 2.5,
          py: 1.5,
          borderRadius: 2.5,
          bgcolor: ACCENT_COLORS.indigo.bg,
          border: `1px solid ${ACCENT_COLORS.indigo.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: '#fff',
            color: ACCENT_COLORS.indigo.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${ACCENT_COLORS.indigo.border}`,
          }}
        >
          <TaskAltIcon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: ACCENT_COLORS.indigo.dark }}>
            Tasks & Meetings
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Non-hearing agenda items for this date
          </Typography>
        </Box>
      </Box>

      <DataTable<TimelineItem>
        loading={loading}
        rows={tasks}
        accentColor="indigo"
        showRowNumbers
        emptyMessage="No tasks scheduled for this date."
        getRowId={(row) => row.id}
        columns={[
          {
            id: 'time',
            label: 'Time',
            width: 100,
            render: (row) =>
              row.time ? (
                <Box
                  sx={{
                    display: 'inline-block',
                    px: 1.5,
                    py: 0.75,
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
                '—'
              ),
          },
          {
            id: 'title',
            label: 'Task',
            render: (row) => (
              <Box>
                <Typography variant="body2" fontWeight={700}>
                  {row.title}
                </Typography>
                {row.caseId && row.caseTitle && (
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
            id: 'description',
            label: 'Description',
            render: (row) => (
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
                {row.description ?? '—'}
              </Typography>
            ),
          },
          {
            id: 'status',
            label: 'Status',
            width: 130,
            render: (row) => (
              <Chip
                label={taskTypeLabel(row.status)}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: 11,
                  bgcolor: ACCENT_COLORS.indigo.bg,
                  color: ACCENT_COLORS.indigo.dark,
                  textTransform: 'capitalize',
                }}
              />
            ),
          },
        ]}
      />
    </Box>
  );
}
