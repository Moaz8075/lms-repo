import Typography from '@mui/material/Typography';
import type { TypographyProps } from '@mui/material/Typography';

export function MonoLabel({ children, sx, ...props }: TypographyProps) {
  return (
    <Typography
      component="span"
      sx={{
        fontFamily: 'var(--font-jetbrains-mono), "JetBrains Mono", monospace',
        fontSize: 12,
        letterSpacing: '0.02em',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}
