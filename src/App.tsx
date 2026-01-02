import {
  AppBar,
  Box,
  Chip,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
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

type UiEvent = {
  type: string
  at: string
  payload: unknown
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

    const es = new EventSource(`${baseUrl}/events`)
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ display: 'flex', gap: 1 }}>
          <Typography variant="h6" fontWeight={700} sx={{ flex: 1 }}>
            Review Assistant
          </Typography>

          <Chip
            size="small"
            label={connected ? 'SSE 연결됨' : '연결 끊김'}
            color={connected ? 'success' : 'default'}
            variant={connected ? 'filled' : 'outlined'}
          />

          <Chip size="small" label={baseUrl ?? 'API 미연결'} variant="outlined" />
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body1" fontWeight={600}>
              상태
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {events.length ? `최근 이벤트: ${events[0].type}` : 'Ready.'}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
              이벤트 로그 (최근 50개)
            </Typography>

            <List dense sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
              {events.map((e, idx) => {
                const title = isObject(e.payload) ? pickString(e.payload['title']) : null
                const reviewCount = isObject(e.payload)
                  ? pickNumber(e.payload['reviewCount'])
                  : null

                return (
                  <ListItem key={`${e.at}-${idx}`} divider>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
                          <Typography component="span" fontWeight={700}>
                            {e.type}
                          </Typography>
                          <Typography component="span" sx={{ opacity: 0.7, fontSize: 12 }}>
                            {e.at}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        title
                          ? `${title}${reviewCount !== null ? ` · 리뷰 ${reviewCount}개` : ''}`
                          : undefined
                      }
                    />
                  </ListItem>
                )
              })}

              {!events.length ? (
                <ListItem>
                  <ListItemText primary="아직 이벤트가 없어요." />
                </ListItem>
              ) : null}
            </List>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
