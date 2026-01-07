import type { ButtonProps } from '@mui/material'
import { Button } from '@mui/material'

import { TextPillLabel } from '../text/Text.presets'

type ActionButtonProps = Omit<ButtonProps, 'size' | 'variant' | 'children'> & {
  label: string
}

export default function ActionButton({ label, sx, ...props }: ActionButtonProps) {
  return (
    <Button
      size="small"
      variant="outlined"
      sx={{
        minHeight: 28,
        borderRadius: 999,
        textTransform: 'none',
        ...sx,
      }}
      {...props}
    >
      <TextPillLabel>{label}</TextPillLabel>
    </Button>
  )
}
