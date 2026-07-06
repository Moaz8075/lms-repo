import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import type { ReactNode } from 'react';
import { ACCENT_COLORS, type AccentColor } from '@/utils/design-tokens';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  color?: AccentColor;
  trend?: string;
}

export function StatCard({ label, value, icon, color = 'blue', trend }: StatCardProps) {
  const c = ACCENT_COLORS[color];

  return (
    <Card
      sx={{
        bgcolor: c.light,
        border: `1px solid ${c.border}`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 24px ${c.main}22`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          bgcolor: c.main,
        },
      }}
    >
      <CardContent sx={{ pt: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" sx={{ color: c.dark, fontWeight: 600, mb: 0.5 }}>
              {label}
            </Typography>
            <Typography variant="h5" fontWeight={700} sx={{ color: c.dark, lineHeight: 1.2 }}>
              {value}
            </Typography>
            {trend && (
              <Chip
                label={trend}
                size="small"
                sx={{
                  mt: 1,
                  bgcolor: c.bg,
                  color: c.main,
                  fontWeight: 700,
                  height: 22,
                  fontSize: 11,
                  border: `1px solid ${c.border}`,
                }}
              />
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                bgcolor: c.bg,
                color: c.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${c.border}`,
                '& .MuiSvgIcon-root': { fontSize: 26 },
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
