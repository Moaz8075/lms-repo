'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import GavelIcon from '@mui/icons-material/Gavel';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SettingsIcon from '@mui/icons-material/Settings';
import BalanceIcon from '@mui/icons-material/Balance';
import { NAV_ITEMS, SIDEBAR_WIDTH } from '@/utils/constants';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionResource } from '@/types/permissions';

const ICON_MAP = {
  Dashboard: DashboardIcon,
  People: PeopleIcon,
  Gavel: GavelIcon,
  MenuBook: MenuBookIcon,
  LibraryBooks: LibraryBooksIcon,
  Settings: SettingsIcon,
} as const;

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { isAdmin, canView } = usePermissions();

  const visibleItems = NAV_ITEMS.filter((item) => {
    if ('adminOnly' in item && item.adminOnly) return isAdmin;
    if ('resource' in item && item.resource) {
      return canView(item.resource as PermissionResource);
    }
    return true;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 2.5, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#F4F8FF', borderBottom: '1px solid #E8F0FE' }}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: '#1A73E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <BalanceIcon sx={{ fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
            LegalEase
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Case Management
          </Typography>
        </Box>
      </Box>

      <List sx={{ px: 1.5, flex: 1 }}>
        {visibleItems.map((item) => {
          const Icon = ICON_MAP[item.icon];
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive}
                onClick={onNavigate}
                sx={{
                  borderRadius: 2,
                  borderLeft: '3px solid transparent',
                  '&.Mui-selected': {
                    bgcolor: '#E8F0FE',
                    color: 'primary.main',
                    borderLeftColor: 'primary.main',
                    fontWeight: 600,
                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                    '&:hover': { bgcolor: '#D2E3FC' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'inherit' : 'text.secondary' }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: isActive ? 600 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <SidebarContent onNavigate={onMobileClose} />
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        open
      >
        <SidebarContent />
      </Drawer>
    </>
  );
}
