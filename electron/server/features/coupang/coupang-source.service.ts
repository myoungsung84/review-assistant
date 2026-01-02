import type { CoupangPayload } from './coupang-source.schema'

export class CoupangSourceService {
  constructor(
    private readonly deps: {
      emit: (type: string, payload: unknown) => void
    },
  ) {}

  publishProduct = async (payload: CoupangPayload) => {
    // Renderer로 브로드캐스트
    this.deps.emit('COUPANG_PRODUCT_PUBLISHED', {
      ...payload,
      url: payload.url,
      reviewCount: payload.reviews.length,
    })
    console.log('[coupang] product published:', payload.title)
    // HTTP 응답은 요약만
    return {
      ok: true,
      title: payload.title,
      reviewCount: payload.reviews.length,
    }
  }
}
