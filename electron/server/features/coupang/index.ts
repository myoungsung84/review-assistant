// features/coupang/index.ts
import type { Router } from '@e/server/types/router.types'

import type { FeatureContext } from '../features.types'
import { CoupangSourceController } from './coupang-source.controller'
import { CoupangSourceService } from './coupang-source.service'

export function coupangSourceRoutes(r: Router, ctx: FeatureContext) {
  const service = new CoupangSourceService({
    emit: ctx.eventHub.emit.bind(ctx.eventHub),
  })
  const controller = new CoupangSourceController(service)

  r.post('/sources/coupang/publish', controller.publishProduct)
}
