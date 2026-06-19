'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/utils/format';
import { ROUTES } from '@/utils/constants';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { user, organization, clearAuth } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    clearAuth();
    router.push(ROUTES.login);
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' } }}
          aria-label="open navigation"
        >
          <MenuIcon />
        </IconButton>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'background.default',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            flex: 1,
            maxWidth: 480,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <SearchIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase placeholder="Search cases, clients..." sx={{ flex: 1, fontSize: 14 }} />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton aria-label="notifications">
          <Badge variant="dot" color="primary">
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>

        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}>
            {user ? getInitials(user.firstName, user.lastName) : '?'}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1, minWidth: 200 }}>
            <Typography variant="subtitle2">
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
            {organization && (
              <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>
                {organization.name}
              </Typography>
            )}
          </Box>
          <Divider />
          <MenuItem onClick={() => { setAnchorEl(null); router.push(ROUTES.settings); }}>
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
