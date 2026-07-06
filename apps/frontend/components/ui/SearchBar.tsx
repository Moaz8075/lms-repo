'use client';

import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  sx?: object;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
  sx,
}: SearchBarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
        borderRadius: 2,
        px: 1.5,
        py: 0.75,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'border-color 0.2s',
        '&:focus-within': {
          borderColor: 'primary.main',
        },
        ...sx,
      }}
    >
      <SearchIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
      <InputBase
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        sx={{ flex: 1, fontSize: 14 }}
        fullWidth
      />
    </Box>
  );
}
