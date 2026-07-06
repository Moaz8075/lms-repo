'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1A73E8',
      dark: '#1557B0',
      light: '#4A90F0',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#515F74',
    },
    success: {
      main: '#16A34A',
      light: '#E6F4EA',
      dark: '#15803D',
    },
    warning: {
      main: '#F59E0B',
      light: '#FEF7E0',
      dark: '#B45309',
    },
    error: {
      main: '#DC2626',
      light: '#FCE8E6',
      dark: '#B91C1C',
    },
    info: {
      main: '#0891B2',
      light: '#E0F7FA',
      dark: '#0E7490',
    },
    background: {
      default: '#F7FAFD',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#181C1F',
      secondary: '#414754',
    },
    divider: '#E0E3E6',
  },
  typography: {
    fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10, px: 2.5 },
        contained: {
          boxShadow: '0 1px 2px rgba(26, 115, 232, 0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(24, 28, 31, 0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 12,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(24, 28, 31, 0.15)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: '#414754',
          backgroundColor: '#F4F8FF',
          borderBottom: '2px solid #E8F0FE',
        },
        body: {
          borderBottom: '1px solid #F0F2F5',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': { borderBottom: 0 },
          '&:hover': { backgroundColor: '#FAFCFF !important' },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: 14,
          textTransform: 'none',
          minHeight: 48,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: '#FAFCFF',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1A73E8',
            },
          },
        },
      },
    },
  },
});
