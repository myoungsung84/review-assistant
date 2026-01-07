import type { StackProps } from '@mui/material'
import { Stack } from '@mui/material'

type ButtonGroupBarProps = StackProps

export default function ButtonGroupBar({ sx, ...props }: ButtonGroupBarProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      sx={{
        '& .MuiButton-root': {
          minHeight: 28,
          paddingTop: 0,
          paddingBottom: 0,
          borderRadius: 999,
          textTransform: 'none',
        },
        ...sx,
      }}
      {...props}
    />
  )
}
