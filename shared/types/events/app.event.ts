import type { CoupangCollectedData } from '../coupang'

export type EventPayloadMap = {
  CONNECTED: {
    clientCount: number
  }
  COUPANG_PRODUCT_PUBLISHED: CoupangCollectedData
  UNKNOWN: null
}

export type MappedEventType = keyof EventPayloadMap

export type AppEvent = {
  [K in MappedEventType]: {
    type: K
    data: EventPayloadMap[K] | Nil | unknown
    at: ISODateString
  }
}[MappedEventType]
