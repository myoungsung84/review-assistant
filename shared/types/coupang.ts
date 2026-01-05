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
  url: string
  title: string
  ogImage?: string
  description?: string
  source?: string
  reviews: CoupangReview[]
  debug?: CoupangCollectionMeta
}
