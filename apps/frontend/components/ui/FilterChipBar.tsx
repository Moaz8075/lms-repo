'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { ACCENT_COLORS, type AccentColor } from '@/utils/design-tokens';

interface FilterOption<T extends string> {
  value: T | '';
  label: string;
  color?: AccentColor;
}

interface FilterChipBarProps<T extends string> {
  options: FilterOption<T>[];
  value: T | '';
  onChange: (value: T | '') => void;
}

export function FilterChipBar<T extends string>({
  options,
  value,
  onChange,
}: FilterChipBarProps<T>) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
      {options.map((opt) => {
        const selected = value === opt.value;
        const c = opt.color ? ACCENT_COLORS[opt.color] : ACCENT_COLORS.blue;

        return (
          <Chip
            key={opt.value || 'all'}
            label={opt.label}
            onClick={() => onChange(opt.value)}
            sx={{
              fontWeight: selected ? 700 : 600,
              borderRadius: 2.5,
              height: 32,
              fontSize: 13,
              transition: 'all 0.15s ease',
              ...(selected
                ? {
                    bgcolor: c.main,
                    color: '#fff',
                    border: `1px solid ${c.main}`,
                    boxShadow: `0 2px 8px ${c.main}44`,
                    '&:hover': { bgcolor: c.dark },
                  }
                : {
                    bgcolor: c.light,
                    color: c.dark,
                    border: `1px solid ${c.border}`,
                    '&:hover': { bgcolor: c.bg },
                  }),
            }}
          />
        );
      })}
    </Box>
  );
}
