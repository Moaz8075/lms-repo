'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1A73E8',
      dark: '#005BBF',
      light: '#4A90F0',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#515F74',
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
    error: {
      main: '#BA1A1A',
    },
  },
  typography: {
    fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
    h4: { fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #E0E3E6',
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#414754',
          backgroundColor: '#F7FAFD',
        },
      },
    },
  },
});
