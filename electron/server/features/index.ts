import type { Router } from '@e/server/types/router.types'

import { coupangSourceRoutes } from './coupang'
import { eventsRoutes } from './events'
import type { FeatureContext, FeatureRoute } from './features.types'
import { healthRoutes } from './health'

const features: FeatureRoute[] = [healthRoutes, coupangSourceRoutes, eventsRoutes]

export function registerFeatureRoutes(r: Router, ctx: FeatureContext) {
  features.forEach(fn => fn(r, ctx))
}
