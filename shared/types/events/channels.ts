export const EVENT_CHANNELS = {
  SYSTEM: 'system',
  COUPANG: 'coupang',
} as const

export type EventChannel = (typeof EVENT_CHANNELS)[keyof typeof EVENT_CHANNELS]
