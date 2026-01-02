import type { CoupangNormalized } from './coupang-source.schema'

export class CoupangSourceService {
  constructor(
    private readonly deps: {
      emit: (type: string, payload: unknown) => void
    },
  ) {}

  publishProduct = async (payload: CoupangNormalized) => {
    // Renderer로 브로드캐스트
    this.deps.emit('COUPANG_PRODUCT_PUBLISHED', payload)

    // HTTP 응답은 요약만
    return {
      ok: true,
      title: payload.title,
      reviewCount: payload.reviews.length,
    }
  }
}
