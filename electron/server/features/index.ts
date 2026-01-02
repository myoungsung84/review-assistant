import type { Router } from '@e/server/types/router.types'

import { coupangSourceRoutes } from './coupang'
import type { FeatureContext, FeatureRoute } from './features.types'
import { healthRoutes } from './health'

const features: FeatureRoute[] = [healthRoutes, coupangSourceRoutes]

export function registerFeatureRoutes(r: Router, ctx: FeatureContext) {
  features.forEach(fn => fn(r, ctx))
}
