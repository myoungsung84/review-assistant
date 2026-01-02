export type CoupangPublishPayload = {
  url: string
  title: string
  ogImage?: string
  description?: string
  source?: string // collector name (extension 등)
  reviews: Array<{
    content?: string
    author?: string
    rating?: number
    date?: string
    helpfulCount?: number
  }>
  debug?: {
    usedSelector?: string
    foundReviewItems?: number
    notes?: string[]
  }
}

export type CoupangNormalized = {
  url: string
  title: string
  ogImage?: string
  description?: string
  source?: string
  reviews: Array<{
    content: string
    author?: string
    rating?: number
    date?: string
    helpfulCount?: number
  }>
  debug?: CoupangPublishPayload['debug']
}

function normalizeText(s?: string, maxLen = 5000) {
  const t = (s ?? '').replace(/\s+/g, ' ').trim()
  if (!t) return ''
  return t.length > maxLen ? t.slice(0, maxLen) : t
}

function clampRating(n?: number) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return undefined
  const v = Math.round(n)
  if (v < 1) return 1
  if (v > 5) return 5
  return v
}

function normalizeImageUrl(raw?: string) {
  if (!raw) return undefined
  if (raw.startsWith('//')) return `https:${raw}`
  return raw
}

/**
 * - 최소 검증: url/title/reviews array 여부
 * - 정규화: title 길이 제한, review content 필터링/정리, rating/helpfulCount 보정
 */
export function parseCoupangPublishPayload(
  input: unknown,
): { ok: true; value: CoupangNormalized } | { ok: false; error: string } {
  if (!input || typeof input !== 'object') return { ok: false, error: 'body must be object' }

  const p = input as Partial<CoupangPublishPayload>

  if (!p.url || typeof p.url !== 'string') return { ok: false, error: 'url required' }
  if (!p.title || typeof p.title !== 'string') return { ok: false, error: 'title required' }
  if (!Array.isArray(p.reviews)) return { ok: false, error: 'reviews must be array' }

  const reviews = (p.reviews ?? [])
    .map(r => {
      const content = normalizeText(r?.content)
      if (!content) return null
      return {
        content,
        author: typeof r.author === 'string' ? r.author.trim() || undefined : undefined,
        rating: clampRating(r.rating),
        date: typeof r.date === 'string' ? r.date : undefined,
        helpfulCount:
          typeof r.helpfulCount === 'number' &&
          Number.isFinite(r.helpfulCount) &&
          r.helpfulCount >= 0
            ? Math.floor(r.helpfulCount)
            : undefined,
      }
    })
    .filter((x): x is NonNullable<typeof x> => !!x)

  const normalized: CoupangNormalized = {
    url: p.url.trim(),
    title: normalizeText(p.title, 200),
    ogImage: normalizeImageUrl(typeof p.ogImage === 'string' ? p.ogImage : undefined),
    description: typeof p.description === 'string' ? p.description : undefined,
    source: typeof p.source === 'string' ? p.source : undefined,
    reviews,
    debug: p.debug,
  }

  return { ok: true, value: normalized }
}
