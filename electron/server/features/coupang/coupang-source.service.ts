import type { CoupangPayload } from './coupang-source.schema'

export class CoupangSourceService {
  constructor(
    private readonly deps: {
      emit: (channel: string, type: string, payload?: unknown) => void
    },
  ) {}

  publishProduct = async (payload: CoupangPayload) => {
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
