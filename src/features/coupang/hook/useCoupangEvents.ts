import { AppEvent, MappedEventType } from '@s/types/events/app.event'
import * as React from 'react'

import { useEventStream } from '@/shared/hook/useEventStream'

export type CoupangEventHandlers = Partial<{
  [K in MappedEventType]: (ev: Extract<AppEvent, { type: K }>) => void
}>

function callHandler(handlers: CoupangEventHandlers | undefined, ev: AppEvent) {
  const type = ev.type
  const handler = handlers?.[type]
  if (!handler) return
  ;(handler as (e: Extract<AppEvent, { type: typeof type }>) => void)(
    ev as Extract<AppEvent, { type: typeof type }>,
  )
}

export function useCoupangEvents(opts: {
  baseUrl: string | null
  enabled?: boolean
  handlers?: CoupangEventHandlers
}) {
  const handlersRef = React.useRef<CoupangEventHandlers | undefined>(opts.handlers)

  React.useEffect(() => {
    handlersRef.current = opts.handlers
  }, [opts.handlers])

  const stream = useEventStream({
    baseUrl: opts.baseUrl,
    enabled: opts.enabled ?? true,
    path: '/events/coupang',
    onEvent: (ev: AppEvent) => {
      callHandler(handlersRef.current, ev)
    },
  })

  return { ...stream }
}
