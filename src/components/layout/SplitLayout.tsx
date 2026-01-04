import { Box, Stack } from '@mui/material'
import type { ReactNode } from 'react'

export default function SplitLayout({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <Stack spacing={1} direction="row">
      <Box
        sx={{
          flexBasis: '40%',
          flexShrink: 0,
          minWidth: 0,
          minHeight: 0,
        }}
      >
        {left}
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          minHeight: 0,
        }}
      >
        {right}
      </Box>
    </Stack>
  )
}
