import { CoupangCollectedData } from '@s/types/coupang'
import { EVENT_TYPES, EventChannel, EventType } from '@s/types/events'
import { EventPayloadMap } from '@s/types/events/app.event'

export class CoupangSourceService {
  constructor(
    private readonly deps: {
      emit: <T extends EventType>(
        channel: EventChannel,
        type: T,
        payload: EventPayloadMap[T],
      ) => void
    },
  ) {}

  public publishProduct = async (payload: CoupangCollectedData) => {
    console.log('[coupang-source.service] publishProduct called', payload)
    const data = {
      ...payload,
      reviewCount: payload.reviews.length,
    } satisfies EventPayloadMap[typeof EVENT_TYPES.COUPANG_PRODUCT_PUBLISHED]
    this.deps.emit('coupang', 'COUPANG_PRODUCT_PUBLISHED', data)
    return {
      ok: true,
      title: payload.title,
      reviewCount: payload.reviews.length,
    }
  }
}
