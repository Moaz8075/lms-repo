'use client';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import { useCases } from '@/hooks/useCases';
import { useSelectedCaseId } from '@/hooks/useCaseSelection';
import { MonoLabel } from './MonoLabel';

interface CaseSelectProps {
  sx?: object;
  label?: string;
}

export function CaseSelect({ sx, label = 'Select Case' }: CaseSelectProps) {
  const { caseId, setCaseId } = useSelectedCaseId();
  const { data, isLoading } = useCases({ limit: 100 });

  const cases = data?.items ?? [];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  return (
    <FormControl size="small" sx={{ minWidth: 280, ...sx }}>
      <InputLabel id="case-select-label">{label}</InputLabel>
      <Select
        labelId="case-select-label"
        label={label}
        value={caseId}
        onChange={(e) => setCaseId(e.target.value)}
        displayEmpty
      >
        <MenuItem value="">
          <em>Choose a case…</em>
        </MenuItem>
        {cases.map((c) => (
          <MenuItem key={c.id} value={c.id}>
            <Box>
              <MonoLabel>{c.caseNumber}</MonoLabel>
              {' — '}
              {c.title}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
