import { CoupangCollectedData } from '@s/types/coupang'
import { EventChannel, EventType } from '@s/types/events'

export class CoupangSourceService {
  constructor(
    private readonly deps: {
      emit: (channel: EventChannel, type: EventType, payload?: unknown) => void
    },
  ) {}

  publishProduct = async (payload: CoupangCollectedData) => {
    this.deps.emit('coupang', 'COUPANG_PRODUCT_PUBLISHED', {
      ...payload,
      url: payload.url,
      reviewCount: payload.reviews.length,
    })

    console.log('[coupang] product published:', payload.title)

    return {
      ok: true,
      title: payload.title,
      reviewCount: payload.reviews.length,
    }
  }
}
