import {
  alpha,
  AppBar,
  Box,
  Chip,
  Container,
  createTheme,
  CssBaseline,
  Divider,
  Paper,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    api: {
      ping: () => Promise<string>
      getServerInfo: () => Promise<{ port: number; baseUrl: string }>
    }
  }
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}
function pickString(v: unknown): string | null {
  return typeof v === 'string' ? v : null
}
function pickNumber(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null
}
function pickArray(v: unknown): unknown[] | null {
  return Array.isArray(v) ? v : null
}

type UiEvent = {
  type: string
  at: string
  payload: unknown
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0B0D10', // 거의 블랙
      paper: '#0F1217', // 카드/패널
    },
    text: {
      primary: '#E9EEF5',
      secondary: alpha('#E9EEF5', 0.72),
    },
    divider: alpha('#E9EEF5', 0.08),
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily:
      'Inter, Pretendard, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#0B0D10',
          borderBottom: `1px solid ${alpha('#E9EEF5', 0.08)}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
        },
      },
    },
  },
})

function Panel({
  title,
  right,
  children,
}: {
  title: string
  right?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        height: '100%',
        overflow: 'hidden',
        borderRadius: 0,
        borderColor: alpha('#E9EEF5', 0.08),
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 900, letterSpacing: -0.2 }}>
            {title}
          </Typography>
          {right}
        </Stack>
      </Box>
      <Divider />
      <Box
        sx={{
          p: 2,
          height: 'calc(100% - 53px)',
          overflow: 'auto',
          '&::-webkit-scrollbar': { width: 10 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha('#E9EEF5', 0.14),
            borderRadius: 999,
            border: `3px solid ${darkTheme.palette.background.paper}`,
          },
        }}
      >
        {children}
      </Box>
    </Paper>
  )
}

function CoupangPanel({ payload }: { payload: unknown }) {
  if (!isObject(payload)) {
    return (
      <Typography variant="body2" color="text.secondary">
        아직 쿠팡 데이터가 없어요. (Collector에서 전송되면 여기 표시됨)
      </Typography>
    )
  }

  const title = pickString(payload['title']) ?? pickString(payload['productTitle'])
  const brand = pickString(payload['brand'])
  const priceText = pickString(payload['priceText']) ?? pickString(payload['price'])
  const rating = pickNumber(payload['rating'])
  const reviewCount = pickNumber(payload['reviewCount'])
  const imageUrl = pickString(payload['imageUrl']) ?? pickString(payload['thumbnailUrl'])

  const badgesRaw = pickArray(payload['badges'])
  const badges = (badgesRaw ?? [])
    .map(v => pickString(v))
    .filter((v): v is string => Boolean(v))
    .slice(0, 5)

  const reviewsRaw = pickArray(payload['reviews']) ?? pickArray(payload['items'])
  const reviews = (reviewsRaw ?? [])
    .map(v => (isObject(v) ? v : null))
    .filter((v): v is Record<string, unknown> => Boolean(v))
    .slice(0, 12)

  return (
    <Stack spacing={2}>
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          borderColor: alpha('#E9EEF5', 0.08),
          p: 2,
          bgcolor: alpha('#0B0D10', 0.35),
        }}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box
            sx={{
              width: 92,
              height: 92,
              borderRadius: 2,
              border: `1px solid ${alpha('#E9EEF5', 0.08)}`,
              bgcolor: alpha('#E9EEF5', 0.04),
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {imageUrl ? (
              <Box
                component="img"
                src={imageUrl}
                alt=""
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : null}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack spacing={0.75}>
              <Typography variant="subtitle1" sx={{ fontWeight: 950, lineHeight: 1.25 }}>
                {title ?? '상품명 없음(매핑 필요)'}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {brand ? <Chip size="small" label={brand} variant="outlined" /> : null}
                {badges.map(b => (
                  <Chip key={b} size="small" label={b} />
                ))}
              </Stack>

              <Stack direction="row" spacing={1.25} alignItems="center">
                {typeof rating === 'number' ? (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`★ ${rating.toFixed(1)}`}
                    sx={{ borderColor: alpha('#E9EEF5', 0.14) }}
                  />
                ) : null}
                {typeof reviewCount === 'number' ? (
                  <Typography variant="body2" color="text.secondary">
                    리뷰 {reviewCount.toLocaleString()}개
                  </Typography>
                ) : null}
              </Stack>

              <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: -0.3 }}>
                {priceText ?? '가격 정보 없음'}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Divider />

      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
            리뷰
          </Typography>
          <Typography variant="caption" color="text.secondary">
            (상세 필터/정렬은 다음 단계)
          </Typography>
        </Stack>

        {!reviews.length ? (
          <Typography variant="body2" color="text.secondary">
            payload에 reviews 배열이 없어요. (리뷰 매핑 필요)
          </Typography>
        ) : (
          <Stack spacing={1.25}>
            {reviews.map((r, idx) => {
              const rRating = pickNumber(r['rating'])
              const content =
                pickString(r['content']) ?? pickString(r['text']) ?? pickString(r['review']) ?? ''
              const optionText = pickString(r['optionText']) ?? pickString(r['option'])
              const dateText = pickString(r['dateText']) ?? pickString(r['date'])
              const userText = pickString(r['userText']) ?? pickString(r['user'])

              if (!content) return null
              const short = content.length > 240 ? `${content.slice(0, 240)}…` : content

              return (
                <Paper
                  key={`${idx}`}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    borderColor: alpha('#E9EEF5', 0.08),
                    p: 2,
                    bgcolor: alpha('#0B0D10', 0.25),
                  }}
                >
                  <Stack spacing={0.75}>
                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                          {userText ?? '구매자'}
                        </Typography>
                        {dateText ? (
                          <Typography variant="caption" color="text.secondary">
                            {dateText}
                          </Typography>
                        ) : null}
                      </Stack>

                      {typeof rRating === 'number' ? (
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`★ ${rRating}`}
                          sx={{ borderColor: alpha('#E9EEF5', 0.14) }}
                        />
                      ) : null}
                    </Stack>

                    {optionText ? (
                      <Typography variant="caption" color="text.secondary">
                        {optionText}
                      </Typography>
                    ) : null}

                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                      {short}
                    </Typography>
                  </Stack>
                </Paper>
              )
            })}
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

export default function App() {
  const [connected, setConnected] = useState(false)
  const [baseUrl, setBaseUrl] = useState<string | null>(null)
  const [events, setEvents] = useState<UiEvent[]>([])
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    let alive = true
    void (async () => {
      try {
        const info = await window.api.getServerInfo()
        if (!alive) return
        setBaseUrl(info.baseUrl)
      } catch {
        if (!alive) return
        setBaseUrl(null)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!baseUrl) return

    esRef.current?.close()
    esRef.current = null

    const EVENTS_URL = import.meta.env.DEV ? '/events' : `${baseUrl}/events`
    const es = new EventSource(EVENTS_URL)
    esRef.current = es

    es.onopen = () => setConnected(true)
    es.onerror = () => setConnected(false)

    es.onmessage = ev => {
      let msg: unknown
      try {
        msg = JSON.parse(ev.data) as unknown
      } catch {
        return
      }
      if (!isObject(msg)) return

      const type = pickString(msg['type']) ?? 'UNKNOWN'
      const at = pickString(msg['at']) ?? new Date().toISOString()
      const payload = 'payload' in msg ? msg['payload'] : null

      setEvents(prev => [{ type, at, payload }, ...prev].slice(0, 50))
    }

    return () => {
      es.close()
    }
  }, [baseUrl])

  const latest = events[0] ?? null
  const latestPayload = latest?.payload ?? null

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="sticky" elevation={0}>
          <Toolbar sx={{ display: 'flex', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: -0.3, flex: 1 }}>
              Review Assistant
            </Typography>

            {latest ? (
              <Chip
                size="small"
                variant="outlined"
                label={`최근: ${latest.type}`}
                sx={{ borderColor: alpha('#E9EEF5', 0.14), maxWidth: 300 }}
              />
            ) : (
              <Chip
                size="small"
                variant="outlined"
                label="최근 이벤트 없음"
                sx={{ borderColor: alpha('#E9EEF5', 0.14) }}
              />
            )}

            <Chip
              size="small"
              label={connected ? 'SSE 연결됨' : '연결 끊김'}
              color={connected ? 'success' : 'default'}
              variant={connected ? 'filled' : 'outlined'}
              sx={!connected ? { borderColor: alpha('#E9EEF5', 0.14) } : undefined}
            />

            <Chip
              size="small"
              label={baseUrl ?? 'API 미연결'}
              variant="outlined"
              sx={{ borderColor: alpha('#E9EEF5', 0.14) }}
            />
          </Toolbar>
        </AppBar>

        <Container sx={{ py: 2, height: 'calc(100vh - 64px)' }}>
          <Stack spacing={2} sx={{ height: '100%' }}>
            <Stack direction="row" spacing={2} sx={{ flex: 1, minHeight: 0 }}>
              <Box sx={{ flex: 1.25, minWidth: 520, minHeight: 0 }}>
                <Panel title="쿠팡 상품 · 리뷰">
                  <CoupangPanel payload={latestPayload} />
                </Panel>
              </Box>

              <Box sx={{ flex: 0.95, minWidth: 420, minHeight: 0 }}>
                <Panel
                  title="YouTube (준비중)"
                  right={
                    <Chip
                      size="small"
                      label="TODO"
                      variant="outlined"
                      sx={{ borderColor: alpha('#E9EEF5', 0.14) }}
                    />
                  }
                >
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    쿠팡 UX 먼저 마무리하고, 다음 단계로 URL 큐/다운로드/요약을 붙이자.
                  </Typography>
                </Panel>
              </Box>
            </Stack>

            <Box sx={{ height: 220, minHeight: 220 }}>
              <Panel title="최종 결과물 (준비중)">
                <Typography variant="body2" color="text.secondary">
                  나중에 여기에서 최종 리뷰 출력/편집 영역 붙이면 됨.
                </Typography>
              </Panel>
            </Box>
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
