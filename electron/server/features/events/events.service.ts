import type { EventHub } from '@e/server/transport/event-hub'

export class EventsService {
  constructor(private readonly deps: { eventHub: EventHub }) {}

  getClientCount() {
    return this.deps.eventHub.getClientCount()
  }

  buildConnectedEvent(channel: string) {
    return {
      type: 'CONNECTED',
      payload: {
        channel,
        clientCount: this.getClientCount() + 1,
      },
      at: new Date().toISOString(),
    }
  }
}
