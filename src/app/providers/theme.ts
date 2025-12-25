import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  typography: {
    fontFamily: [
      'system-ui',
      '-apple-system',
      'Segoe UI',
      'Roboto',
      'Noto Sans KR',
      'Apple SD Gothic Neo',
      'sans-serif',
    ].join(','),
  },
})
