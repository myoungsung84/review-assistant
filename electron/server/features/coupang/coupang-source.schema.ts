import { CoupangCollectedData } from '@s/types/coupang'
import { isObject, normalizeText } from '@s/utils'

type ParseResult = { ok: true; value: CoupangCollectedData } | { ok: false; error: string }

function clampRating(v: unknown): number | undefined {
  if (typeof v !== 'number' || !Number.isFinite(v)) return undefined
  const n = Math.round(v)
  if (n < 1) return 1
  if (n > 5) return 5
  return n
}

function normalizeHelpfulCount(v: unknown): number | undefined {
  if (typeof v !== 'number' || !Number.isFinite(v) || v < 0) return undefined
  return Math.floor(v)
}

function normalizeImageUrl(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined
  const raw = v.trim()
  if (!raw) return undefined
  if (raw.startsWith('//')) return `https:${raw}`
  return raw
}

/**
 * 서버가 아직 `{ savedAt, snapshot: {...} }` 형태로 받는 경우까지 여기서 흡수.
 * - input이 flat이면 그대로 사용
 * - input이 wrapped면 snapshot을 펼쳐서 flat으로 변환하고 debug에 meta/trace를 합침
 */
function unwrapToFlat(input: unknown): Record<string, unknown> | null {
  if (!isObject(input)) return null

  const snap = input['snapshot']
  if (isObject(snap)) {
    const out: Record<string, unknown> = { ...snap }

    // trace → debug로 흡수
    const trace = snap['trace']
    const debugBase = isObject(snap['debug']) ? { ...snap['debug'] } : {}

    if (typeof input['savedAt'] === 'string') debugBase['savedAt'] = input['savedAt']
    if (typeof snap['capturedAt'] === 'string') debugBase['capturedAt'] = snap['capturedAt']

    if (isObject(trace)) {
      if (typeof trace['usedSelector'] === 'string')
        debugBase['usedSelector'] = trace['usedSelector']
      if (typeof trace['foundItems'] === 'number')
        debugBase['foundReviewItems'] = trace['foundItems']
    }

    out['debug'] = debugBase
    delete out['trace'] // 이제 불필요

    return out
  }

  return input
}

function normalizeDebug(v: unknown): CoupangCollectedData['debug'] | undefined {
  if (!isObject(v)) return undefined

  const out: NonNullable<CoupangCollectedData['debug']> = {}

  if (typeof v['usedSelector'] === 'string' && v['usedSelector'].trim())
    out.usedSelector = v['usedSelector'].trim()
  if (typeof v['foundReviewItems'] === 'number' && Number.isFinite(v['foundReviewItems']))
    out.foundReviewItems = Math.floor(v['foundReviewItems'])
  if (typeof v['capturedAt'] === 'string' && v['capturedAt'].trim())
    out.capturedAt = v['capturedAt'].trim()
  if (typeof v['savedAt'] === 'string' && v['savedAt'].trim()) out.savedAt = v['savedAt'].trim()

  if (Array.isArray(v['notes'])) {
    const notes = v['notes']
      .filter((x): x is string => typeof x === 'string')
      .map(x => x.trim())
      .filter(Boolean)
    if (notes.length) out.notes = notes.slice(0, 50)
  }

  return Object.keys(out).length ? out : undefined
}

/**
 * - 최소 검증: url/title/reviews array 여부
 * - 정규화: title 길이 제한, review content 필터링/정리, rating/helpfulCount 보정
 * - 입력은 flat / wrapped 둘 다 받음
 */
export function parseCoupangPublishPayload(input: unknown): ParseResult {
  const flat = unwrapToFlat(input)
  if (!flat) return { ok: false, error: 'body must be object' }

  const url = typeof flat['url'] === 'string' ? flat['url'].trim() : ''
  const titleRaw = typeof flat['title'] === 'string' ? flat['title'] : ''
  const reviewsRaw = flat['reviews']

  if (!url) return { ok: false, error: 'url required' }
  if (!titleRaw) return { ok: false, error: 'title required' }
  if (!Array.isArray(reviewsRaw)) return { ok: false, error: 'reviews must be array' }

  const reviews = reviewsRaw
    .map((r: unknown) => {
      if (!isObject(r)) return null

      const content = normalizeText(typeof r['content'] === 'string' ? r['content'] : undefined)
      if (!content) return null

      return {
        content,
        author: typeof r['author'] === 'string' ? r['author'].trim() || undefined : undefined,
        rating: clampRating(r['rating']),
        date: typeof r['date'] === 'string' ? r['date'] : undefined,
        helpfulCount: normalizeHelpfulCount(r['helpfulCount']),
      }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  const value: CoupangCollectedData = {
    source: typeof flat['source'] === 'string' ? flat['source'] : undefined,
    url,
    title: normalizeText(titleRaw, 200),
    ogImage: normalizeImageUrl(flat['ogImage']),
    description: typeof flat['description'] === 'string' ? flat['description'] : undefined,
    sale:
      typeof flat['sale'] === 'number' && Number.isFinite(flat['sale'])
        ? Math.max(0, flat['sale'])
        : undefined,
    original:
      typeof flat['original'] === 'number' && Number.isFinite(flat['original'])
        ? Math.max(0, flat['original'])
        : undefined,
    discountRate:
      typeof flat['discountRate'] === 'number' && Number.isFinite(flat['discountRate'])
        ? Math.min(100, Math.max(0, flat['discountRate']))
        : undefined,
    unitPriceText:
      typeof flat['unitPriceText'] === 'string' ? normalizeText(flat['unitPriceText'], 100) : null,
    text: typeof flat['text'] === 'string' ? normalizeText(flat['text'], 5000) : null,
    reviews,
    reviewCount:
      typeof flat['reviewCount'] === 'number' && Number.isFinite(flat['reviewCount'])
        ? Math.max(0, Math.floor(flat['reviewCount']))
        : 0,
    ratingNumber:
      typeof flat['ratingNumber'] === 'number' && Number.isFinite(flat['ratingNumber'])
        ? Math.min(5, Math.max(0, flat['ratingNumber']))
        : 0,

    debug: normalizeDebug(flat['debug']),
  }

  return { ok: true, value }
}
