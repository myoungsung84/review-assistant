import { EVENT_TYPES } from '@s/types/events'
import { AppEvent } from '@s/types/events/app.event'
import { isNil } from '@s/utils'
import * as React from 'react'

import { useEventStream } from '@/shared/hook/useEventStream'
import { useServerInfo } from '@/shared/hook/useServerInfo'

type ConnectedEvent = Extract<AppEvent, { type: typeof EVENT_TYPES.CONNECTED }>
type ProductPublishedEvent = Extract<
  AppEvent,
  { type: typeof EVENT_TYPES.COUPANG_PRODUCT_PUBLISHED }
>
type UnknownEvent = Extract<AppEvent, { type: typeof EVENT_TYPES.UNKNOWN }>

export type CoupangEventHandlers = Partial<{
  onConnected: (ev: ConnectedEvent) => void
  onCoupangProductPublished: (ev: ProductPublishedEvent) => void
  onUnknown: (ev: UnknownEvent) => void
}>

export function useCoupangEvents(opts: { handlers?: CoupangEventHandlers }) {
  const baseUrl = useServerInfo().baseUrl
  const handlersRef = React.useRef<CoupangEventHandlers | undefined>(opts.handlers)

  React.useEffect(() => {
    handlersRef.current = opts.handlers
  }, [opts.handlers])

  const stream = useEventStream({
    baseUrl: baseUrl,
    enabled: !isNil(baseUrl),
    path: '/events/coupang',
    onEvent: (ev: AppEvent) => {
      switch (ev.type) {
        case 'CONNECTED': {
          handlersRef.current?.onConnected?.(ev)
          return
        }

        case 'COUPANG_PRODUCT_PUBLISHED': {
          handlersRef.current?.onCoupangProductPublished?.(ev)
          return
        }

        default:
        case 'UNKNOWN': {
          handlersRef.current?.onUnknown?.(ev)
          return
        }
      }
    },
  })

  return { ...stream }
}
