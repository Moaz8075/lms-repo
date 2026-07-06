'use client';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import { formatDayHeading, shiftDateString, toDateInputValue } from '@/utils/format';
import { ACCENT_COLORS } from '@/utils/design-tokens';

interface DiaryDayPickerProps {
  date: string;
  onChange: (date: string) => void;
  totalCases?: number;
}

export function DiaryDayPicker({ date, onChange, totalCases }: DiaryDayPickerProps) {
  const c = ACCENT_COLORS.teal;
  const isToday = date === toDateInputValue();

  return (
    <Box
      sx={{
        p: 2.5,
        mb: 3,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${c.light} 0%, ${c.bg} 100%)`,
        border: `1px solid ${c.border}`,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 2,
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
          <TodayIcon />
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: c.dark, fontWeight: 700, letterSpacing: '0.06em' }}>
            ROZNAMCHA DATE
          </Typography>
          <Typography variant="h6" fontWeight={700} sx={{ color: c.dark, lineHeight: 1.2 }}>
            {formatDayHeading(date)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <IconButton
          size="small"
          onClick={() => onChange(shiftDateString(date, -1))}
          sx={{ bgcolor: '#fff', border: `1px solid ${c.border}`, color: c.dark }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <TextField
          type="date"
          size="small"
          value={date}
          onChange={(e) => onChange(e.target.value)}
          sx={{
            width: 160,
            '& .MuiOutlinedInput-root': {
              bgcolor: '#fff',
              fontWeight: 600,
            },
          }}
        />

        <IconButton
          size="small"
          onClick={() => onChange(shiftDateString(date, 1))}
          sx={{ bgcolor: '#fff', border: `1px solid ${c.border}`, color: c.dark }}
        >
          <ChevronRightIcon />
        </IconButton>

        {!isToday && (
          <Chip
            label="Today"
            size="small"
            onClick={() => onChange(toDateInputValue())}
            sx={{
              bgcolor: c.main,
              color: '#fff',
              fontWeight: 700,
              '&:hover': { bgcolor: c.dark },
            }}
          />
        )}

        {totalCases !== undefined && (
          <Chip
            label={`${totalCases} case${totalCases === 1 ? '' : 's'}`}
            size="small"
            sx={{
              bgcolor: '#fff',
              color: c.dark,
              fontWeight: 700,
              border: `1px solid ${c.border}`,
            }}
          />
        )}
      </Box>
    </Box>
  );
}
