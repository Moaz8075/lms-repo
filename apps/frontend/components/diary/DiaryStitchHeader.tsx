'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { formatDayHeading, shiftDateString, toDateInputValue } from '@/utils/format';

const NAVY = '#0B1D3A';

interface DiaryStitchHeaderProps {
  date: string;
  onChange: (date: string) => void;
}

export function DiaryStitchHeader({ date, onChange }: DiaryStitchHeaderProps) {
  const isToday = date === toDateInputValue();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        mb: 3,
      }}
    >
      <Typography variant="h4" fontWeight={800} sx={{ color: NAVY, letterSpacing: '-0.02em' }}>
        Diary
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.5,
          py: 0.75,
          borderRadius: 3,
          bgcolor: '#fff',
          border: '2px solid',
          borderColor: isToday ? '#1A73E8' : NAVY,
          boxShadow: isToday
            ? '0 4px 16px rgba(26, 115, 232, 0.2)'
            : '0 4px 16px rgba(11, 29, 58, 0.12)',
        }}
      >
        <IconButton
          size="small"
          onClick={() => onChange(shiftDateString(date, -1))}
          sx={{
            border: '1px solid #E2E8F0',
            bgcolor: '#F8FAFC',
            '&:hover': { bgcolor: '#EFF6FF', borderColor: '#1A73E8' },
          }}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>

        <Box
          sx={{
            px: 2,
            py: 0.75,
            minWidth: 260,
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: isToday ? '#EFF6FF' : '#F1F5F9',
            border: '1px solid',
            borderColor: isToday ? '#BFDBFE' : '#E2E8F0',
          }}
        >
          {isToday && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: '#1A73E8',
                mb: 0.25,
              }}
            >
              TODAY
            </Typography>
          )}
          <Typography
            variant="subtitle1"
            fontWeight={800}
            sx={{ color: NAVY, lineHeight: 1.25, fontSize: { xs: 14, sm: 16 } }}
          >
            {formatDayHeading(date)}
          </Typography>
        </Box>

        <IconButton
          size="small"
          onClick={() => onChange(shiftDateString(date, 1))}
          sx={{
            border: '1px solid #E2E8F0',
            bgcolor: '#F8FAFC',
            '&:hover': { bgcolor: '#EFF6FF', borderColor: '#1A73E8' },
          }}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>

        {!isToday && (
          <Button
            size="small"
            variant="contained"
            onClick={() => onChange(toDateInputValue())}
            sx={{
              ml: 0.5,
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: '#1A73E8',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1557B0', boxShadow: 'none' },
            }}
          >
            Today
          </Button>
        )}
      </Box>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        disabled
        sx={{
          bgcolor: NAVY,
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 2,
          px: 2.5,
          boxShadow: 'none',
          '&:hover': { bgcolor: '#162844', boxShadow: 'none' },
          '&.Mui-disabled': { bgcolor: '#94A3B8', color: '#fff' },
        }}
      >
        Add Task
      </Button>
    </Box>
  );
}
