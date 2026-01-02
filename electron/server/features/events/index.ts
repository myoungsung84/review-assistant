import { IncomingMessage, ServerResponse } from 'node:http'

import { sendSuccess } from '@e/server/transport'
import type { EventHub } from '@e/server/transport/event-hub'
import type { Router } from '@e/server/types/router.types'

export function eventsRoutes(r: Router, deps: { eventHub: EventHub }) {
  r.get('/events', async (req: IncomingMessage, res: ServerResponse) => {
    // CORS 헤더는 corsMiddleware가 담당. 여기서는 빼자.
    console.log('[events] origin =', req.headers.origin)

    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    })

    res.write(
      `data: ${JSON.stringify({
        type: 'CONNECTED',
        payload: { clientCount: deps.eventHub.getClientCount() + 1 },
        at: new Date().toISOString(),
      })}\n\n`,
    )

    deps.eventHub.addSseClient(res)
    console.log('[events] new client connected')
  })

  r.get('/events/health', async (_req: IncomingMessage, res: ServerResponse) => {
    sendSuccess(res, { ok: true, clientCount: deps.eventHub.getClientCount() })
  })
}
