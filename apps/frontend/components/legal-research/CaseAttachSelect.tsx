'use client';

import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useCases } from '@/hooks/useCases';
import { MonoLabel } from '@/components/ui/MonoLabel';

interface CaseAttachSelectProps {
  value: string;
  onChange: (caseId: string) => void;
  error?: boolean;
  helperText?: string;
}

export function CaseAttachSelect({
  value,
  onChange,
  error,
  helperText = 'Link this note as a reference on the selected case',
}: CaseAttachSelectProps) {
  const { data, isLoading } = useCases({ limit: 100 });
  const cases = data?.items ?? [];

  return (
    <TextField
      select
      label="Attach to case (optional)"
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={isLoading}
      error={error}
      helperText={helperText}
    >
      <MenuItem value="">None</MenuItem>
      {cases.map((caseItem) => (
        <MenuItem key={caseItem.id} value={caseItem.id}>
          <MonoLabel>{caseItem.caseNumber}</MonoLabel>
          {' — '}
          {caseItem.title}
        </MenuItem>
      ))}
    </TextField>
  );
}
