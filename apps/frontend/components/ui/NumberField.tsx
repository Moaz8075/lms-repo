'use client';

import { forwardRef } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';

const numberInputSx = {
  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
    {
      WebkitAppearance: 'none',
      margin: 0,
    },
} as const;

export const NumberField = forwardRef<HTMLDivElement, TextFieldProps>(function NumberField(
  { onWheel, onKeyDown, sx, ...props },
  ref,
) {
  return (
    <TextField
      ref={ref}
      type="number"
      sx={{ ...numberInputSx, ...sx }}
      onWheel={(e) => {
        (e.target as HTMLElement).blur();
        onWheel?.(e);
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault();
        }
        onKeyDown?.(e);
      }}
      {...props}
    />
  );
});
