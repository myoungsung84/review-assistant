// features/coupang/index.ts
import { EventChannel, EventType } from '@s/types/events'
import { EventPayloadMap } from '@s/types/events/app.event'

import type { Router } from '@e/server/types/router.types'

import type { FeatureContext } from '../features.types'
import { CoupangSourceController } from './coupang-source.controller'
import { CoupangSourceService } from './coupang-source.service'

export function coupangSourceRoutes(r: Router, ctx: FeatureContext) {
  const service = new CoupangSourceService({
    emit: <T extends EventType>(channel: EventChannel, type: T, payload: EventPayloadMap[T]) =>
      ctx.eventHub.emit(channel, type, payload),
  })
  const controller = new CoupangSourceController(service)

  r.post('/sources/coupang/publish', controller.publishProduct)
}
