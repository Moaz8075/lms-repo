'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useEffect, useMemo, useState } from 'react';
import type { UpcomingDateGroup } from '@/types';

const NAVY = '#0B1D3A';
const PRIMARY = '#1A73E8';
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface DiaryUpcomingSidebarProps {
  groups: UpcomingDateGroup[];
  loading?: boolean;
  selectedDate: string;
  onDateSelect: (date: string) => void;
  datesWithItems?: Set<string>;
}

function countBreakdown(items: UpcomingDateGroup['items']) {
  let hearings = 0;
  let tasks = 0;
  let meetings = 0;

  for (const item of items) {
    if (item.type === 'HEARING') {
      hearings++;
    } else if (item.taskType === 'CLIENT_MEETING') {
      meetings++;
    } else {
      tasks++;
    }
  }

  return { hearings, tasks, meetings, total: items.length };
}

function breakdownText({ hearings, tasks, meetings }: ReturnType<typeof countBreakdown>) {
  const parts: string[] = [];
  if (hearings) parts.push(`${hearings} Hearing${hearings === 1 ? '' : 's'}`);
  if (tasks) parts.push(`${tasks} Task${tasks === 1 ? '' : 's'}`);
  if (meetings) parts.push(`${meetings} Meeting${meetings === 1 ? '' : 's'}`);
  return parts.join(', ') || 'No items';
}

function SegmentedBar({ hearings, tasks, meetings, total }: ReturnType<typeof countBreakdown>) {
  if (total === 0) return null;
  const segments = [
    { count: hearings, color: '#7C3AED' },
    { count: tasks, color: '#2563EB' },
    { count: meetings, color: '#A78BFA' },
  ].filter((s) => s.count > 0);

  return (
    <Box sx={{ display: 'flex', height: 4, borderRadius: 2, overflow: 'hidden', mt: 1.5, gap: '2px' }}>
      {segments.map((seg, i) => (
        <Box
          key={i}
          sx={{
            flex: seg.count,
            bgcolor: seg.color,
            borderRadius: 1,
          }}
        />
      ))}
    </Box>
  );
}

function toMonthKey(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

function parseDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
}

export function DiaryUpcomingSidebar({
  groups,
  loading,
  selectedDate,
  onDateSelect,
  datesWithItems,
}: DiaryUpcomingSidebarProps) {
  const parsed = parseDate(selectedDate);
  const [viewYear, setViewYear] = useState(parsed.year);
  const [viewMonth, setViewMonth] = useState(parsed.month);

  useEffect(() => {
    setViewYear(parsed.year);
    setViewMonth(parsed.month);
  }, [selectedDate, parsed.year, parsed.month]);

  const upcomingPreview = useMemo(() => groups.slice(0, 5), [groups]);

  const calendarDays = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = Array(startPad).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [viewYear, viewMonth]);

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const shiftMonth = (delta: number) => {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onDateSelect(dateStr);
  };

  return (
    <Box>
      {/* Mini calendar */}
      <Box
        sx={{
          p: 2,
          borderRadius: 2.5,
          bgcolor: '#fff',
          border: '1px solid #E2E8F0',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={800} sx={{ color: NAVY, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {monthLabel}
          </Typography>
          <Box>
            <IconButton size="small" onClick={() => shiftMonth(-1)}>
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => shiftMonth(1)}>
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, textAlign: 'center' }}>
          {WEEKDAYS.map((d, i) => (
            <Typography key={i} variant="caption" fontWeight={700} color="text.secondary" sx={{ py: 0.5 }}>
              {d}
            </Typography>
          ))}
          {calendarDays.map((day, i) => {
            if (day === null) return <Box key={`pad-${i}`} />;

            const dateStr = toMonthKey(viewYear, viewMonth) + `-${String(day).padStart(2, '0')}`;
            const isSelected = dateStr === selectedDate;
            const hasItems = datesWithItems?.has(dateStr);

            return (
              <Box
                key={dateStr}
                onClick={() => handleDayClick(day)}
                sx={{
                  py: 0.75,
                  borderRadius: '50%',
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: isSelected ? 14 : 13,
                  fontWeight: isSelected ? 800 : 500,
                  color: isSelected ? '#fff' : NAVY,
                  bgcolor: isSelected ? PRIMARY : 'transparent',
                  position: 'relative',
                  transform: isSelected ? 'scale(1.12)' : 'none',
                  boxShadow: isSelected ? `0 0 0 3px #BFDBFE, 0 4px 12px ${PRIMARY}55` : 'none',
                  zIndex: isSelected ? 1 : 0,
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
                  '&:hover': {
                    bgcolor: isSelected ? PRIMARY : '#EFF6FF',
                    transform: isSelected ? 'scale(1.12)' : 'scale(1.05)',
                  },
                }}
              >
                {day}
                {hasItems && !isSelected && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 3,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 14,
                      height: 3,
                      borderRadius: 1,
                      bgcolor: PRIMARY,
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
      {/* Upcoming dates */}
      <Typography variant="h6" fontWeight={800} sx={{ color: NAVY, mb: 2 }}>
        Upcoming Dates
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} sx={{ color: NAVY }} />
        </Box>
      ) : upcomingPreview.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          No upcoming items in the next 30 days.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
          {upcomingPreview.map((group) => {
            const stats = countBreakdown(group.items);
            const isSelected = group.date === selectedDate;
            return (
              <Box
                key={group.date}
                onClick={() => onDateSelect(group.date)}
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  bgcolor: isSelected ? '#EFF6FF' : '#fff',
                  border: '2px solid',
                  borderColor: isSelected ? PRIMARY : '#E2E8F0',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, background-color 0.15s, box-shadow 0.15s',
                  boxShadow: isSelected ? `0 4px 14px ${PRIMARY}22` : 'none',
                  '&:hover': { borderColor: isSelected ? PRIMARY : '#94A3B8' },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}>
                  <Typography fontWeight={800} sx={{ color: isSelected ? PRIMARY : NAVY }}>
                    {group.label}
                    {isSelected && (
                      <Box
                        component="span"
                        sx={{
                          ml: 1,
                          px: 1,
                          py: 0.15,
                          borderRadius: 1,
                          fontSize: 10,
                          fontWeight: 800,
                          letterSpacing: '0.06em',
                          bgcolor: PRIMARY,
                          color: '#fff',
                          verticalAlign: 'middle',
                        }}
                      >
                        SELECTED
                      </Box>
                    )}
                  </Typography>
                  <Typography variant="caption" fontWeight={700} sx={{ color: '#64748B' }}>
                    {stats.total} item{stats.total === 1 ? '' : 's'}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                  {breakdownText(stats)}
                </Typography>
                <SegmentedBar {...stats} />
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
