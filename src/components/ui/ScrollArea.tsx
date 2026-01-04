import { Box } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'

export default function ScrollArea({ children, sx }: { children: ReactNode; sx?: SxProps<Theme> }) {
  return <Box sx={{ height: '100%', minHeight: 0, overflow: 'auto', ...sx }}>{children}</Box>
}
