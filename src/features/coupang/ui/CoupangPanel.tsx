import { Box, Button, Chip, Divider, Stack, Typography } from '@mui/material'
import * as React from 'react'

import { Panel } from '@/components/layout'
import { useCoupangEvents } from '@/features/coupang/hook/useCoupangEvents'
import { useServerInfo } from '@/shared/hook/useServerInfo'
import { isRecord } from '@/shared/utils/type-guards'

import CoupangSourceView from './CoupangSourceView'

type CoupangSourcePayload = {
  productTitle?: string
  reviewCount?: number
  hasSummary?: boolean
}

function parseCoupangSourcePayload(payload: unknown): CoupangSourcePayload | null {
  if (!isRecord(payload)) return null

  const productTitle = typeof payload.productTitle === 'string' ? payload.productTitle : undefined
  const reviewCount = typeof payload.reviewCount === 'number' ? payload.reviewCount : undefined
  const hasSummary = typeof payload.hasSummary === 'boolean' ? payload.hasSummary : undefined

  if (productTitle === undefined && reviewCount === undefined && hasSummary === undefined)
    return null
  return { productTitle, reviewCount, hasSummary }
}

export default function CoupangPanel() {
  const baseUrl = useServerInfo().baseUrl

  // 사용자가 누르는 토글 (연결/해제는 훅이 담당)
  const [enabled, setEnabled] = React.useState<boolean>(false)

  // PROD: baseUrl 없으면 연결 불가 / DEV: 상대경로라 baseUrl 없어도 가능(프록시 전제)
  const canUseSse = import.meta.env.DEV || baseUrl !== null
  const sseEnabled = enabled && canUseSse

  const { status, events, clear, clientCount, isRunning } = useCoupangEvents({
    baseUrl,
    enabled: sseEnabled,
  })

  const lastSource = React.useMemo(() => {
    const hit = events.find(e => e.type === 'COUPANG_SOURCE' || e.type === 'COUPANG_COLLECTED')
    return hit ? parseCoupangSourcePayload(hit.payload) : null
  }, [events])

  const hasSource = Boolean(lastSource?.productTitle)

  return (
    <Panel
      title="Coupang"
      badge={<Chip size="small" label="Optional" variant="outlined" />}
      actions={
        <Stack direction="row" spacing={1} alignItems="center">
          {/* 기존 액션 유지 */}
          <Button size="small" variant="outlined" disabled={!hasSource}>
            Raw
          </Button>
          <Button size="small" variant="outlined">
            Load
          </Button>

          {/* SSE 액션 */}
          <Divider flexItem orientation="vertical" sx={{ mx: 0.5, opacity: 0.4 }} />

          <Chip size="small" label={status} variant="outlined" sx={{ fontFamily: 'monospace' }} />

          {typeof clientCount === 'number' ? (
            <Chip size="small" label={`clients ${clientCount}`} variant="outlined" />
          ) : null}

          <Button
            size="small"
            variant="contained"
            onClick={() => {
              if (!canUseSse) return
              setEnabled(true)
            }}
            disabled={isRunning || !canUseSse}
          >
            Start
          </Button>

          <Button
            size="small"
            variant="outlined"
            onClick={() => setEnabled(false)}
            disabled={!isRunning}
          >
            Stop
          </Button>

          <Button size="small" variant="text" onClick={clear} disabled={events.length === 0}>
            Clear
          </Button>
        </Stack>
      }
    >
      <Stack spacing={1.25} sx={{ minHeight: 0 }}>
        <SseSummary status={status} isRunning={isRunning} eventCount={events.length} />

        {hasSource ? (
          <LoadedState
            productTitle={lastSource?.productTitle ?? '제품명 예시'}
            reviewCount={lastSource?.reviewCount ?? 0}
            hasSummary={lastSource?.hasSummary ?? false}
          />
        ) : (
          <EmptyState />
        )}

        <EventLog events={events} />
      </Stack>
    </Panel>
  )
}

function SseSummary(props: { status: string; isRunning: boolean; eventCount: number }) {
  const { status, isRunning, eventCount } = props

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {isRunning ? (
        <Chip size="small" color="success" label="SSE ON" variant="outlined" />
      ) : (
        <Chip size="small" label="SSE OFF" variant="outlined" />
      )}
      <Chip size="small" label={`status ${status}`} variant="outlined" />
      <Chip size="small" label={`events ${eventCount}`} variant="outlined" />
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

function LoadedState(props: { productTitle: string; reviewCount: number; hasSummary: boolean }) {
  const { productTitle, reviewCount, hasSummary } = props

  return (
    <Stack spacing={1.25} sx={{ minHeight: 0 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Chip size="small" color="success" label="Included" variant="outlined" />
        {hasSummary ? (
          <Chip size="small" label="Summary OK" variant="outlined" />
        ) : (
          <Chip size="small" color="warning" label="No Summary" variant="outlined" />
        )}
      </Stack>

      <Typography sx={{ fontWeight: 700 }} noWrap title={productTitle}>
        {productTitle}
      </Typography>

      <Stack direction="row" spacing={1}>
        <Chip size="small" label={`Reviews ${reviewCount}`} variant="outlined" />
        <Chip size="small" label="Source: Saved" variant="outlined" />
      </Stack>

      <CoupangSourceView />
    </Stack>
  )
}

function EventLog(props: { events: Array<{ type: string; payload?: unknown; at?: string }> }) {
  const { events } = props

  return (
    <Box
      sx={{
        mt: 0.5,
        p: 1,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
        minHeight: 120,
        maxHeight: 240,
        overflow: 'auto',
        fontFamily: 'monospace',
        fontSize: 12,
      }}
    >
      <Typography variant="caption" sx={{ opacity: 0.7 }}>
        Event log (dev)
      </Typography>

      {events.length === 0 ? (
        <Typography sx={{ opacity: 0.6, mt: 0.5 }}>No events</Typography>
      ) : (
        <Stack spacing={0.75} sx={{ mt: 0.75 }}>
          {events.slice(0, 50).map((ev, i) => (
            <Box
              key={`${ev.at ?? 'na'}-${i}`}
              sx={{ pb: 0.75, borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box sx={{ minWidth: 170, opacity: 0.7 }}>{ev.at ?? '-'}</Box>
                <Box sx={{ minWidth: 160 }}>{ev.type}</Box>
              </Box>
              {ev.payload !== undefined ? (
                <pre
                  style={{
                    margin: 0,
                    opacity: 0.9,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {JSON.stringify(ev.payload, null, 2)}
                </pre>
              ) : null}
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  )
}
