import type http from 'node:http'

type EventMessage = {
  type: string
  payload: unknown
  at: string
}

type SseClient = {
  id: string
  res: http.ServerResponse
}

export class EventHub {
  private clients = new Map<string, SseClient>()

  addSseClient(res: http.ServerResponse) {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    this.clients.set(id, { id, res })

    res.on('close', () => {
      this.clients.delete(id)
    })

    return id
  }

  emit(type: string, payload: unknown) {
    const message: EventMessage = {
      type,
      payload,
      at: new Date().toISOString(),
    }

    const data = `data: ${JSON.stringify(message)}\n\n`

    for (const [, client] of this.clients) {
      try {
        client.res.write(data)
      } catch {
        this.clients.delete(client.id)
      }
    }
  }
  getClientCount() {
    return this.clients.size
  }
}
