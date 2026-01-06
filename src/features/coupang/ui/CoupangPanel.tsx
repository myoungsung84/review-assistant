import { Box, Button, Chip, Skeleton, Stack, Typography } from '@mui/material'
import type { AppEvent } from '@s/types/events/app.event'
import { isNil } from '@s/utils'
import * as React from 'react'
import { useCallback, useMemo, useState } from 'react'

import { Panel } from '@/components/layout'
import { useCoupangEvents } from '@/features/coupang/hook/useCoupangEvents'

export default function CoupangPanel() {
  const [lastPublished, setLastPublished] = useState<
    Extract<AppEvent, { type: 'COUPANG_PRODUCT_PUBLISHED' }>['data'] | null
  >(null)

  const onHandlePublished = useCallback(
    (ev: Extract<AppEvent, { type: 'COUPANG_PRODUCT_PUBLISHED' }>) => {
      const data = ev.data
      if (isNil(data)) return

      setLastPublished(data)
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

  const hasProduct = useMemo(() => !!lastPublished, [lastPublished])

  return (
    <Panel
      title="Coupang"
      badge={<Chip size="small" label="Optional" variant="outlined" />}
      actions={
        <Stack direction="row" spacing={1} alignItems="center">
          <Button size="small" variant="outlined" disabled={!isRunning}>
            Raw
          </Button>
          <Button size="small" variant="outlined" onClick={() => clear()} disabled={!isRunning}>
            Clear
          </Button>
        </Stack>
      }
    >
      <Stack spacing={1} sx={{ minHeight: 0 }}>
        <SseSummary status={status} isRunning={isRunning} eventCount={events.length} />
        {hasProduct ? (
          <LoadedState
            imageUrl={lastPublished?.ogImage ?? null}
            title={lastPublished?.title ?? 'No Title'}
            reviewCount={lastPublished?.reviewCount ?? 0}
            hasSummary={!!(lastPublished?.description ?? '').trim()}
          />
        ) : (
          <EmptyState />
        )}
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

function CoupangStateFrame(props: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <Box
      sx={{
        p: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
        minHeight: 168, // ✅ Empty/Loaded 동일 높이
        display: 'flex',
        gap: 1.5,
        alignItems: 'stretch',
      }}
    >
      <Box
        sx={{
          width: 112,
          minWidth: 112,
          borderRadius: 1,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'action.hover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {props.left}
      </Box>

      <Box sx={{ minWidth: 0, flex: 1, display: 'flex' }}>{props.right}</Box>
    </Box>
  )
}

function EmptyState() {
  return (
    <CoupangStateFrame
      left={<Skeleton variant="rectangular" width="100%" height="100%" />}
      right={
        <Stack spacing={1} sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip size="small" label="No Data" variant="outlined" />
            <Chip size="small" label="Waiting Collector" variant="outlined" />
          </Stack>

          <Stack spacing={0.5} sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700 }}>쿠팡 상품정보가 아직 없어요</Typography>
            <Typography variant="body2" color="text.secondary">
              수집기를 통해 상품+리뷰 데이터를 불러와 주세요.
            </Typography>
          </Stack>

          <Stack spacing={0.75} sx={{ pt: 0.5 }}>
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="45%" />
            <Stack direction="row" spacing={1} sx={{ pt: 0.5 }}>
              <Skeleton variant="rounded" width={90} height={24} />
              <Skeleton variant="rounded" width={110} height={24} />
            </Stack>
          </Stack>
        </Stack>
      }
    />
  )
}

function LoadedState(props: {
  imageUrl?: string | null
  title: string
  reviewCount: number
  hasSummary?: boolean
}) {
  const hasSummary = props.hasSummary ?? false

  return (
    <CoupangStateFrame
      left={
        props.imageUrl ? (
          <Box
            component="img"
            src={props.imageUrl}
            alt={props.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Skeleton variant="rectangular" width="100%" height="100%" />
        )
      }
      right={
        <Stack spacing={1} sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip size="small" color="success" label="Included" variant="outlined" />
            {hasSummary ? (
              <Chip size="small" label="Summary OK" variant="outlined" />
            ) : (
              <Chip size="small" color="warning" label="No Summary" variant="outlined" />
            )}
          </Stack>

          <Typography sx={{ fontWeight: 700 }} noWrap title={props.title}>
            {props.title}
          </Typography>

          <Stack direction="row" spacing={1}>
            <Chip size="small" label={`Reviews ${props.reviewCount}`} variant="outlined" />
            <Chip size="small" label="Source: Saved" variant="outlined" />
          </Stack>
        </Stack>
      }
    />
  )
}
