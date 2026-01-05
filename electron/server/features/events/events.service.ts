import { EventChannel } from '@s/types/events/channels'
import { nowISO } from '@s/utils'

import type { EventHub } from '@e/server/transport/event-hub'

export class EventsService {
  constructor(private readonly deps: { eventHub: EventHub }) {}

  getClientCount() {
    return this.deps.eventHub.getClientCount()
  }

  buildConnectedEvent(channel: EventChannel) {
    return {
      type: 'CONNECTED',
      data: {
        channel,
        clientCount: this.getClientCount() + 1,
      },
      at: nowISO(),
    }
  }
}
