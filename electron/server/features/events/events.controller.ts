import type { IncomingMessage, ServerResponse } from 'node:http'

import type { EventHub } from '@e/server/transport/event-hub'

import type { EventsService } from './events.service'

export class EventsController {
  constructor(
    private readonly deps: {
      eventHub: EventHub
      eventsService: EventsService
    },
  ) {}

  connect(_req: IncomingMessage, res: ServerResponse, opts: { channel: string }) {
    console.log('[events] connect channel =', opts.channel)
    this.setupHeaders(res)
    this.write(res, this.deps.eventsService.buildConnectedEvent(opts.channel))
    this.deps.eventHub.addSseClient(opts.channel, res)
  }

  private setupHeaders(res: ServerResponse) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    })
  }

  private write(res: ServerResponse, event: unknown) {
    res.write(`data: ${JSON.stringify(event)}\n\n`)
  }
}
