import { Box, Button, Chip, Stack, Typography } from '@mui/material'

import { Panel } from '@/components/layout'

import YoutubeQueueList from './YoutubeQueueList'

type QueueItem = {
  id: string
  title: string
  url: string
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
}

export default function YoutubePanel() {
  // TODO: 실제 상태 연결
  const items: QueueItem[] = [
    {
      id: '1',
      title: '제품 설명 요약',
      url: 'https://youtube.com/watch?v=xxxxx',
      status: 'COMPLETED',
    },
    {
      id: '2',
      title: '비교 리뷰',
      url: 'https://youtube.com/watch?v=yyyyy',
      status: 'QUEUED',
    },
    {
      id: '3',
      title: '사용기',
      url: 'https://youtube.com/watch?v=zzzzz',
      status: 'PROCESSING',
    },
  ]

  const completedCount = items.filter(v => v.status === 'COMPLETED').length
  const hasAny = items.length > 0

  return (
    <Panel
      title="YouTube"
      actions={
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" disabled={!hasAny}>
            Clear
          </Button>
          <Button size="small" variant="contained">
            + URL
          </Button>
        </Stack>
      }
    >
      {hasAny ? <LoadedState items={items} completedCount={completedCount} /> : <EmptyState />}
    </Panel>
  )
}

function EmptyState() {
  return (
    <Box
      sx={{
        p: 1.5,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'action.hover',
      }}
    >
      <Stack spacing={0.5}>
        <Typography sx={{ fontWeight: 700 }}>유튜브 입력이 아직 없어요</Typography>
        <Typography variant="body2" color="text.secondary">
          URL을 추가하면 큐에 쌓이고, 요약 완료(Completed)된 것만 생성에 포함돼요.
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Chip size="small" label="포함 조건: Completed(요약 완료)만" variant="outlined" />
        </Stack>
      </Stack>
    </Box>
  )
}

function LoadedState({ items, completedCount }: { items: QueueItem[]; completedCount: number }) {
  const included = completedCount > 0

  return (
    <Stack spacing={1.25} sx={{ minHeight: 0 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        {included ? (
          <Chip
            size="small"
            color="success"
            label={`Included ${completedCount}`}
            variant="outlined"
          />
        ) : (
          <Chip size="small" label="Included 0" variant="outlined" />
        )}

        <Chip size="small" label={`Queue ${items.length}`} variant="outlined" />
      </Stack>

      <YoutubeQueueList items={items} />
    </Stack>
  )
}
