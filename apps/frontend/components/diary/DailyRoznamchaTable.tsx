'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import { DataTable } from '@/components/ui/DataTable';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { ACCENT_COLORS } from '@/utils/design-tokens';
import { formatDate, formatTime } from '@/utils/format';
import type { DiaryCaseRow } from '@/types';

interface DailyRoznamchaTableProps {
  rows: DiaryCaseRow[];
  loading?: boolean;
  selectedDate: string;
}

export function DailyRoznamchaTable({ rows, loading, selectedDate }: DailyRoznamchaTableProps) {
  return (
    <DataTable<DiaryCaseRow>
      loading={loading}
      rows={rows}
      accentColor="teal"
      showRowNumbers
      title={`${rows.length} case${rows.length === 1 ? '' : 's'} in court — ${formatDate(selectedDate)}`}
      emptyMessage={`No court hearings found for ${formatDate(selectedDate)}. Try another date using the picker above.`}
      getRowId={(row) => row.hearingId}
      columns={[
        {
          id: 'caseName',
          label: 'Case Name',
          render: (row, index) => {
            const accent =
              ACCENT_COLORS[
                ['blue', 'indigo', 'teal', 'violet', 'amber'][index % 5] as keyof typeof ACCENT_COLORS
              ];
            return (
              <Box>
                <Link
                  component={NextLink}
                  href={`/cases/${row.caseId}`}
                  underline="hover"
                  fontWeight={700}
                  sx={{ color: accent.dark, fontSize: 15, display: 'block', mb: 0.5 }}
                >
                  {row.caseTitle}
                </Link>
                <MonoLabel>{row.caseNumber}</MonoLabel>
                <Typography variant="caption" color="text.secondary" display="block" mt={0.25}>
                  {row.clientName}
                </Typography>
              </Box>
            );
          },
        },
        {
          id: 'court',
          label: 'Court',
          render: (row, index) => {
            const accent =
              ACCENT_COLORS[
                ['blue', 'indigo', 'teal', 'violet', 'amber'][index % 5] as keyof typeof ACCENT_COLORS
              ];
            return (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <AccountBalanceOutlinedIcon sx={{ fontSize: 18, color: accent.main, mt: 0.25 }} />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {row.courtName ?? '—'}
                  </Typography>
                  {row.courtRoom && (
                    <Typography variant="caption" color="text.secondary">
                      {row.courtRoom}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          },
        },
        {
          id: 'time',
          label: 'Time',
          width: 100,
          render: (row) =>
            row.hearingTime ? (
              <Box
                sx={{
                  display: 'inline-block',
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 2,
                  bgcolor: ACCENT_COLORS.amber.bg,
                  color: ACCENT_COLORS.amber.dark,
                  fontWeight: 700,
                  fontSize: 13,
                  border: `1px solid ${ACCENT_COLORS.amber.border}`,
                }}
              >
                {formatTime(row.hearingTime)}
              </Box>
            ) : (
              '—'
            ),
        },
        {
          id: 'todayPurpose',
          label: "Today's Purpose",
          render: (row) =>
            row.todayPurpose ? (
              <Typography variant="body2" fontWeight={600} sx={{ maxWidth: 260 }}>
                {row.todayPurpose}
              </Typography>
            ) : (
              '—'
            ),
        },
        {
          id: 'nextDate',
          label: 'Next Hearing Date',
          width: 150,
          render: (row) =>
            row.nextHearingDate ? (
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
                {formatDate(row.nextHearingDate)}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            ),
        },
        {
          id: 'nextPurpose',
          label: 'Next Hearing Purpose',
          render: (row) =>
            row.nextHearingPurpose ? (
              <Box
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: ACCENT_COLORS.indigo.light,
                  border: `1px solid ${ACCENT_COLORS.indigo.border}`,
                  maxWidth: 300,
                }}
              >
                <Typography variant="body2" fontWeight={600} sx={{ color: ACCENT_COLORS.indigo.dark }}>
                  {row.nextHearingPurpose}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            ),
        },
      ]}
    />
  );
}
