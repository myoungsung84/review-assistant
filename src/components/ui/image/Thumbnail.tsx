import { Box } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'

type ThumbnailProps = {
  src?: string
  alt?: string
  width?: number | string
  height?: number | string
  sx?: SxProps<Theme>
}

export default function Thumbnail({
  src,
  alt = '',
  width = 160,
  height = 160,
  sx,
}: ThumbnailProps) {
  return (
    <Box
      sx={{
        width,
        height,
        borderRadius: 1,
        overflow: 'hidden',
        flexShrink: 0,
        ...(src
          ? {
              border: '1px solid rgba(255,255,255,0.08)',
            }
          : {
              border: '1px dashed rgba(255,255,255,0.18)',
              background:
                'radial-gradient(180px 120px at 30% 30%, rgba(255, 255, 255, 0.08), transparent 60%)',
            }),
        ...sx,
      }}
    >
      {src && (
        <Box
          component="img"
          src={src}
          alt={alt}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      )}
    </Box>
  )
}
