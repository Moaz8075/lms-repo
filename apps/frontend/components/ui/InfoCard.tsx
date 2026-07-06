import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { ACCENT_COLORS, type AccentColor } from '@/utils/design-tokens';

interface InfoCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  color?: AccentColor;
}

export function InfoCard({ label, value, icon, color = 'blue' }: InfoCardProps) {
  const c = ACCENT_COLORS[color];

  return (
    <Card
      sx={{
        bgcolor: c.light,
        border: `1px solid ${c.border}`,
        height: '100%',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          {icon && (
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: c.bg,
                color: c.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${c.border}`,
                '& .MuiSvgIcon-root': { fontSize: 20 },
              }}
            >
              {icon}
            </Box>
          )}
          <Typography variant="caption" sx={{ color: c.dark, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </Typography>
        </Box>
        <Typography variant="body1" fontWeight={600} sx={{ color: 'text.primary' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
