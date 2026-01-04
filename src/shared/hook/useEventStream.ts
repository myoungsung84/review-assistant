import * as React from 'react'

import { safeJsonParse } from '../utils/parse'
import { isRecord } from '../utils/type-guards'

export type StreamStatus = 'idle' | 'connecting' | 'open' | 'error' | 'closed'

export type StreamEvent = {
  type: string
  payload?: unknown
  at?: string
}

type ResolveUrlArgs = { baseUrl: string; path: string; isDev: boolean }

type Options = {
  baseUrl: string | null
  path: string // 예: '/events/coupang'
  enabled?: boolean
  maxEvents?: number
  resolveUrl?: (args: ResolveUrlArgs) => string
  onEvent?: (ev: StreamEvent) => void
}

function toStreamEvent(raw: unknown): StreamEvent {
  if (isRecord(raw) && typeof raw.type === 'string') {
    const payload = 'payload' in raw ? raw.payload : undefined
    const at = typeof raw.at === 'string' ? raw.at : undefined
    return { type: raw.type, payload, at }
  }
  return { type: 'MESSAGE', payload: raw, at: new Date().toISOString() }
}

function defaultResolveUrl({ baseUrl, path, isDev }: ResolveUrlArgs) {
  // 과거 코드 호환: DEV면 상대경로(프록시/동일오리진), PROD면 baseUrl 사용
  return isDev ? path : `${baseUrl}${path}`
}

export function useEventStream(opts: Options) {
  const {
    baseUrl,
    path,
    enabled = true,
    maxEvents = 200,
    resolveUrl = defaultResolveUrl,
    onEvent,
  } = opts

  const esRef = React.useRef<EventSource | null>(null)

  // ✅ onEvent가 매 렌더 새로 생성돼도 start/useEffect가 흔들리지 않게 ref로 고정
  const onEventRef = React.useRef<Options['onEvent']>(onEvent)
  React.useEffect(() => {
    onEventRef.current = onEvent
  }, [onEvent])

  const [status, setStatus] = React.useState<StreamStatus>('idle')
  const [events, setEvents] = React.useState<StreamEvent[]>([])

  const stop = React.useCallback(() => {
    const es = esRef.current
    esRef.current = null

    if (es) {
      es.onopen = null
      es.onmessage = null
      es.onerror = null
      es.close()
    }

    // stop은 항상 closed로
    setStatus('closed')
  }, [])

  const buildUrl = React.useCallback(() => {
    const isDev = import.meta.env.DEV
    // DEV는 baseUrl 없어도 path로 붙을 수 있음(프록시 가정)
    const b = baseUrl ?? ''
    return resolveUrl({ baseUrl: b, path, isDev })
  }, [baseUrl, path, resolveUrl])

  const start = React.useCallback(() => {
    if (!enabled) return

    // PROD인데 baseUrl 없으면 못 붙음
    if (!import.meta.env.DEV && !baseUrl) return

    // 연결 중/열림 상태에서 start() 재호출해도 안전하게 재시작
    stop()
    setStatus('connecting')

    const url = buildUrl()

    const es = new EventSource(url)
    esRef.current = es

    es.onopen = () => setStatus('open')

    es.onmessage = (e: MessageEvent<string>) => {
      const raw = safeJsonParse(e.data)
      const ev = toStreamEvent(raw)

      // ✅ ref 통해 호출 (deps에서 onEvent 제거)
      onEventRef.current?.(ev)

      setEvents(prev => {
        const next = [ev, ...prev]
        return next.length > maxEvents ? next.slice(0, maxEvents) : next
      })
    }

    es.onerror = () => {
      // EventSource는 자동 재연결을 시도할 수 있음
      setStatus('error')
    }
  }, [enabled, baseUrl, maxEvents, buildUrl, stop])

  React.useEffect(() => {
    if (!enabled) {
      stop()
      return
    }

    // PROD: baseUrl 준비 전엔 대기
    if (!import.meta.env.DEV && !baseUrl) return

    start()
    return stop
    // ✅ start는 이제 stable (onEvent 빠짐) → 무한루프 방지
  }, [enabled, baseUrl, start, stop])

  React.useEffect(() => stop, [stop])

  const clear = React.useCallback(() => setEvents([]), [])

  const isRunning = status === 'connecting' || status === 'open' || status === 'error'

  return { status, events, start, stop, clear, isRunning }
}
