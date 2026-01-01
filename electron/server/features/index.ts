import type { Router } from '@e/server/types/router.types'
import { healthRoutes } from './health'

const features = [healthRoutes]

export function registerFeatureRoutes(r: Router) {
  features.forEach(fn => fn(r))
}
