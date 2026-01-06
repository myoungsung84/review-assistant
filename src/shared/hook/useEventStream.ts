import type { AppEvent, EventPayloadMap } from '@s/types/events/app.event'
import { nowISO } from '@s/utils'
import { safeJsonParse } from '@s/utils/parser'
import { isObject } from '@s/utils/type-guards'
import * as React from 'react'

export type StreamStatus = 'idle' | 'connecting' | 'open' | 'error' | 'closed'

type ResolveUrlArgs = { baseUrl: string; path: string; isDev: boolean }

type Options = {
  baseUrl: string | null
  path: string
  enabled?: boolean
  maxEvents?: number
  resolveUrl?: (args: ResolveUrlArgs) => string
  onEvent?: (ev: AppEvent) => void
}

function toStreamEvent(raw: unknown): AppEvent {
  if (!isObject(raw)) {
    return { type: 'UNKNOWN', data: null, at: nowISO() }
  }

  const rawType = 'type' in raw ? raw.type : undefined
  const at = (typeof raw.at === 'string' ? raw.at : nowISO()) as ISODateString
  const dataRaw = 'data' in raw ? raw.data : null

  const type =
    rawType === 'CONNECTED' || rawType === 'COUPANG_PRODUCT_PUBLISHED' || rawType === 'UNKNOWN'
      ? rawType
      : 'UNKNOWN'

  switch (type) {
    case 'CONNECTED':
      return {
        type: 'CONNECTED',
        data: (dataRaw as EventPayloadMap['CONNECTED']) ?? null,
        at,
      }

    case 'COUPANG_PRODUCT_PUBLISHED':
      return {
        type: 'COUPANG_PRODUCT_PUBLISHED',
        data: (dataRaw as EventPayloadMap['COUPANG_PRODUCT_PUBLISHED']) ?? null,
        at,
      }

    case 'UNKNOWN':
    default:
      return { type: 'UNKNOWN', data: null, at }
  }
}

function defaultResolveUrl({ baseUrl, path, isDev }: ResolveUrlArgs) {
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

  const onEventRef = React.useRef<Options['onEvent']>(onEvent)
  React.useEffect(() => {
    onEventRef.current = onEvent
  }, [onEvent])

  const [status, setStatus] = React.useState<StreamStatus>('idle')
  const [events, setEvents] = React.useState<AppEvent[]>([])

  const stop = React.useCallback(() => {
    const es = esRef.current
    esRef.current = null

    if (es) {
      es.onopen = null
      es.onmessage = null
      es.onerror = null
      es.close()
    }

    setStatus('closed')
  }, [])

  const buildUrl = React.useCallback(() => {
    const isDev = import.meta.env.DEV
    const b = baseUrl ?? ''
    return resolveUrl({ baseUrl: b, path, isDev })
  }, [baseUrl, path, resolveUrl])

  const start = React.useCallback(() => {
    if (!enabled) return
    if (!import.meta.env.DEV && !baseUrl) return

    stop()
    setStatus('connecting')

    const url = buildUrl()

    const es = new EventSource(url)
    esRef.current = es

    es.onopen = () => setStatus('open')

    es.onmessage = (e: MessageEvent<string>) => {
      // ✅ 여기서부터가 핵심: AppEvent로 “검증”하지 말고 unknown으로 받고 정규화
      const parsed = safeJsonParse<unknown>(e.data)
      const ev = toStreamEvent(parsed)

      onEventRef.current?.(ev)

      setEvents(prev => {
        const next = [ev, ...prev]
        return next.length > maxEvents ? next.slice(0, maxEvents) : next
      })
    }

    es.onerror = () => {
      setStatus('error')
    }
  }, [enabled, baseUrl, maxEvents, buildUrl, stop])

  React.useEffect(() => {
    if (!enabled) {
      stop()
      return
    }
    if (!import.meta.env.DEV && !baseUrl) return

    start()
    return stop
  }, [enabled, baseUrl, start, stop])

  React.useEffect(() => stop, [stop])

  const clear = React.useCallback(() => setEvents([]), [])

  const isRunning = status === 'connecting' || status === 'open' || status === 'error'

  return { status, events, start, stop, clear, isRunning }
}
