'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

interface TagChipsProps {
  tags: string[];
  max?: number;
}

export function TagChips({ tags, max = 3 }: TagChipsProps) {
  if (!tags.length) return <>—</>;

  const visible = tags.slice(0, max);
  const remaining = tags.length - visible.length;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {visible.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          size="small"
          sx={{
            height: 22,
            fontSize: 11,
            fontWeight: 600,
            bgcolor: '#EDE7F6',
            color: '#5B21B6',
            border: '1px solid #D1C4E9',
          }}
        />
      ))}
      {remaining > 0 && (
        <Chip
          label={`+${remaining}`}
          size="small"
          sx={{ height: 22, fontSize: 11, bgcolor: '#F3F4F6', color: '#6B7280' }}
        />
      )}
    </Box>
  );
}

function parseTagsInput(value: string): string[] {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export { parseTagsInput };
