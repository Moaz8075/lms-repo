'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SIDEBAR_WIDTH } from '@/utils/constants';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header onMenuClick={() => setMobileOpen(true)} />
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 } }}>{children}</Box>
      </Box>
    </Box>
  );
}
