import { CssBaseline } from '@mui/material'
import * as React from 'react'

import AppThemeProvider from '@/app/providers/AppThemeProvider'
import { ServerInfoProvider } from '@/app/providers/ServerInfoProvider'

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppThemeProvider>
      <CssBaseline />
      <ServerInfoProvider>{children}</ServerInfoProvider>
    </AppThemeProvider>
  )
}
