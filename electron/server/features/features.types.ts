import type { EventHub } from '@e/server/transport/event-hub'

import { Router } from '../types/router.types'

export type FeatureContext = {
  eventHub: EventHub
}

export type FeatureRoute = (r: Router, ctx: FeatureContext) => void
