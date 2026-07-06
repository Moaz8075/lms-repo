import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        mb: 3,
        pb: 2.5,
        borderBottom: '2px solid',
        borderImage: 'linear-gradient(90deg, #1A73E8 0%, #4F46E5 40%, transparent 100%) 1',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 4,
            height: 40,
            borderRadius: 2,
            background: 'linear-gradient(180deg, #1A73E8 0%, #4F46E5 100%)',
            flexShrink: 0,
            display: { xs: 'none', sm: 'block' },
          }}
        />
        <Box>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              background: 'linear-gradient(135deg, #181C1F 0%, #1A73E8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" mt={0.5} fontWeight={500}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      {action}
    </Box>
  );
}
