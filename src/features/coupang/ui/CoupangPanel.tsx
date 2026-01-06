import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import { AppEvent } from '@s/types/events/app.event'
import { isNil } from '@s/utils'
import { useCallback } from 'react'

import { Panel } from '@/components/layout'
import { useCoupangEvents } from '@/features/coupang/hook/useCoupangEvents'

export default function CoupangPanel() {
  const onHandlePublished = useCallback(
    (ev: Extract<AppEvent, { type: 'COUPANG_PRODUCT_PUBLISHED' }>) => {
      const data = ev.data
      if (isNil(data)) return

      console.log('Coupang product published event received:', data)
    },
    [],
  )

  const { status, events, clear, isRunning } = useCoupangEvents({
    handlers: {
      onConnected: ev => {
        console.log('Coupang SSE connected:', ev)
      },
      onCoupangProductPublished: onHandlePublished,
    },
  })

  return (
    <Panel
      title="Coupang"
      badge={<Chip size="small" label="Optional" variant="outlined" />}
      actions={
        <Stack direction="row" spacing={1} alignItems="center">
          {/* 기존 액션 유지 */}
          <Button size="small" variant="outlined" disabled={!isRunning}>
            Raw
          </Button>
          <Button size="small" variant="outlined" onClick={() => clear()} disabled={!isRunning}>
            Clear
          </Button>
        </Stack>
      }
    >
      <Stack spacing={1}>
        <SseSummary status={status} isRunning={isRunning} eventCount={events.length} />

        {isRunning ? <LoadedState /> : <EmptyState />}
      </Stack>
    </Panel>
  )
}

function SseSummary(props: { status: string; isRunning: boolean; eventCount: number }) {
  const { isRunning } = props

  const color = isRunning ? 'success' : 'warning'
  const label = isRunning ? 'SSE ON' : 'SSE OFF'

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Chip size="small" color={color} label={label} variant="outlined" />
    </Stack>
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
        <Typography sx={{ fontWeight: 700 }}>쿠팡 상품정보가 아직 없어요</Typography>
        <Typography variant="body2" color="text.secondary">
          수집기를 통해 상품+리뷰 데이터를 불러와 주세요.
        </Typography>
      </Stack>
    </Box>
  )
}

function LoadedState() {
  return <></>
  // return (
  //   <Stack spacing={1} sx={{ minHeight: 0 }}>
  //     <Stack direction="row" spacing={1} alignItems="center">
  //       <Chip size="small" color="success" label="Included" variant="outlined" />
  //       {hasSummary ? (
  //         <Chip size="small" label="Summary OK" variant="outlined" />
  //       ) : (
  //         <Chip size="small" color="warning" label="No Summary" variant="outlined" />
  //       )}
  //     </Stack>

  //     <Typography sx={{ fontWeight: 700 }} noWrap title={productTitle}>
  //       {productTitle}
  //     </Typography>

  //     <Stack direction="row" spacing={1}>
  //       <Chip size="small" label={`Reviews ${reviewCount}`} variant="outlined" />
  //       <Chip size="small" label="Source: Saved" variant="outlined" />
  //     </Stack>

  //     <CoupangSourceView />
  //   </Stack>
  // )
}
