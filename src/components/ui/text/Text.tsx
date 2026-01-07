import type { TypographyProps } from '@mui/material'
import { Typography } from '@mui/material'

type TextProps = Omit<TypographyProps, 'variant'> & {
  variant?: TypographyProps['variant']
  clamp?: number
}

export default function Text({ variant = 'body2', clamp, sx, ...props }: TextProps) {
  return (
    <Typography
      {...props}
      variant={variant}
      sx={{
        ...(clamp
          ? {
              display: '-webkit-box',
              WebkitLineClamp: clamp,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }
          : {}),
        ...sx,
      }}
    />
  )
}
