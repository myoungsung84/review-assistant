import { Box, Chip, Stack, Typography } from '@mui/material'

type QueueItem = {
  id: string
  title: string
  url: string
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
}

export default function YoutubeQueueList({ items }: { items: QueueItem[] }) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          maxHeight: 220,
          overflow: 'auto',
          p: 1,
          bgcolor: 'background.paper',
        }}
      >
        <Stack spacing={1}>
          {items.map(v => (
            <Stack
              key={v.id}
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
              sx={{
                p: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'action.hover',
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600 }} noWrap title={v.title}>
                  {v.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap title={v.url}>
                  {v.url}
                </Typography>
              </Box>

              <Chip
                size="small"
                label={v.status}
                color={toChipColor(v.status)}
                variant="outlined"
              />
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

function toChipColor(status: QueueItem['status']) {
  switch (status) {
    case 'COMPLETED':
      return 'success'
    case 'PROCESSING':
      return 'warning'
    case 'FAILED':
      return 'error'
    default:
      return 'default'
  }
}
