import * as React from 'react'

import { type StreamEvent, useEventStream } from '@/shared/hook/useEventStream'
import { isRecord } from '@/shared/utils/type-guards'

type ConnectedPayload = { clientCount?: number }

function parseConnectedPayload(payload: unknown): ConnectedPayload | null {
  if (!isRecord(payload)) return null
  const clientCount = typeof payload.clientCount === 'number' ? payload.clientCount : undefined
  return { clientCount }
}

export function useCoupangEvents(opts: { baseUrl: string | null; enabled?: boolean }) {
  const [clientCount, setClientCount] = React.useState<number | null>(null)

  const stream = useEventStream({
    baseUrl: opts.baseUrl,
    enabled: opts.enabled ?? true,
    path: '/events/coupang',
    onEvent: (ev: StreamEvent) => {
      if (ev.type !== 'CONNECTED') return
      const parsed = parseConnectedPayload(ev.payload)
      if (parsed?.clientCount !== undefined) setClientCount(parsed.clientCount)
    },
  })

  return { ...stream, clientCount }
}
