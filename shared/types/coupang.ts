export type CoupangReview = {
  content: string
  author?: string
  rating?: number
  date?: ISODateString
  helpfulCount?: number
}

export type CoupangCollectionMeta = {
  usedSelector?: string
  foundReviewItems?: number
  notes?: string[]
  capturedAt?: ISODateString
  savedAt?: ISODateString
}

export type CoupangCollectedData = {
  source?: string
  url: string
  title: string
  ogImage?: string
  description?: string
  sale?: number
  original?: number
  discountRate?: number
  unitPriceText?: string | null
  text?: string | null
  reviews: CoupangReview[]
  reviewCount: number
  ratingNumber: number
  debug?: CoupangCollectionMeta
}
