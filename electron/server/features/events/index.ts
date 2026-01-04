import type { IncomingMessage, ServerResponse } from 'node:http'

import type { EventHub } from '@e/server/transport/event-hub'
import type { Router } from '@e/server/types/router.types'

import { EventsController } from './events.controller'
import { EventsService } from './events.service'

export function eventsRoutes(r: Router, deps: { eventHub: EventHub }) {
  const eventsService = new EventsService({ eventHub: deps.eventHub })
  const sseController = new EventsController({ eventHub: deps.eventHub, eventsService })

  r.get('/events/coupang', async (req: IncomingMessage, res: ServerResponse) => {
    sseController.connect(req, res, { channel: 'coupang' })
  })
}
