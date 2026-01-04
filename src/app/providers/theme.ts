import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0b0f14',
      paper: '#0f1620',
    },
    text: {
      primary: '#e6edf3',
      secondary: '#9fb0c0',
    },
    primary: { main: '#6aa6ff' },
    secondary: { main: '#a78bfa' },
    divider: 'rgba(255,255,255,0.10)',
  },

  shape: { borderRadius: 14 },

  typography: {
    fontFamily: [
      'Pretendard',
      'Inter',
      'system-ui',
      '-apple-system',
      'Segoe UI',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h6: { fontWeight: 700 },
    subtitle2: { letterSpacing: 0.2 },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body, #root': { height: '100%' },
        body: { margin: 0 },
        '*': { boxSizing: 'border-box' },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255,255,255,0.08)',
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 700,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'rgba(255,255,255,0.03)',
        },
        notchedOutline: {
          borderColor: 'rgba(255,255,255,0.12)',
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(255,255,255,0.10)' },
      },
    },
  },
})
