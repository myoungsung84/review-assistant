import type { CoupangCollectedData } from '../coupang'
import type { EVENT_TYPES } from './event.types'

export type EventPayloadMap = {
  [EVENT_TYPES.CONNECTED]: {
    clientCount: number
  }
  [EVENT_TYPES.COUPANG_PRODUCT_PUBLISHED]: CoupangCollectedData & {
    reviewCount: number
  }
  [EVENT_TYPES.UNKNOWN]: Nil
}

export type MappedEventType = keyof EventPayloadMap

export type AppEvent = {
  [K in keyof EventPayloadMap]: {
    type: K
    data: EventPayloadMap[K]
    at: string
  }
}[keyof EventPayloadMap]
