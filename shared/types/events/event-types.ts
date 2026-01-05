export const EVENT_TYPES = {
  CONNECTED: 'CONNECTED',
  COUPANG_PRODUCT_PUBLISHED: 'COUPANG_PRODUCT_PUBLISHED',
} as const

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES]
