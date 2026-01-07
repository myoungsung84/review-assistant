import { Box, Divider, Stack } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'

import { TextPanelTitle } from '@/components/ui'

export default function Panel({
  title,
  actions,
  children,
  sx,
  bodySx,
}: {
  title: string
  actions?: ReactNode
  children: ReactNode
  sx?: SxProps<Theme>
  bodySx?: SxProps<Theme>
}) {
  return (
    <Stack
      direction="column"
      sx={{
        height: '100%',
        minHeight: 0,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        backgroundImage: _theme =>
          `linear-gradient(180deg,
            rgba(255,255,255,0.04) 0%,
            rgba(255,255,255,0.02) 45%,
            rgba(0,0,0,0.06) 100%)`,
        backgroundColor: 'background.paper',
        boxShadow: '0 12px 40px rgba(0,0,0,0.28)',
        backdropFilter: 'blur(6px)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(900px 240px at 20% 0%, rgba(76,141,255,0.14), transparent 60%)',
          opacity: 0.9,
        },

        ...sx,
      }}
    >
      <Stack
        direction={'row'}
        spacing={1}
        justifyContent={'space-between'}
        alignItems={'center'}
        p={1.5}
      >
        <Stack direction={'row'} spacing={1}>
          <TextPanelTitle>{title}</TextPanelTitle>
        </Stack>
        {actions}
      </Stack>

      <Divider />

      <Box
        sx={{
          position: 'relative',
          p: 1,
          flex: 1,
          minHeight: 0,
          ...bodySx,
        }}
      >
        {children}
      </Box>
    </Stack>
  )
}
