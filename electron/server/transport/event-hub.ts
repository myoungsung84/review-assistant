import type http from 'node:http'

import { EventChannel, EventType } from '@s/types/events'
import type { EventPayloadMap } from '@s/types/events/app.event'
import { isString, nowISO } from '@s/utils'

type Client = {
  id: string
  res: http.ServerResponse
}

export class EventHub {
  private channels = new Map<EventChannel, Map<string, Client>>()

  addSseClient(channel: EventChannel, res: http.ServerResponse) {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`

    const bucket = this.getOrCreateBucket(channel)
    bucket.set(id, { id, res })

    res.on('close', () => {
      this.removeSseClient(channel, id)
    })

    return id
  }

  removeSseClient(channel: EventChannel, clientIdOrRes: string | http.ServerResponse) {
    const bucket = this.channels.get(channel)
    if (!bucket) return

    if (isString(clientIdOrRes)) {
      bucket.delete(clientIdOrRes)
      if (bucket.size === 0) this.channels.delete(channel)
      return
    }

    for (const [id, client] of bucket) {
      if (client.res === clientIdOrRes) {
        bucket.delete(id)
        break
      }
    }
    if (bucket.size === 0) this.channels.delete(channel)
  }

  // emitTyped<T extends EventType>(channel: EventChannel, type: T, payload: EventPayloadMap[T]) {
  //   this.emit(channel, type, payload)
  // }

  // makeEvent
  makeEvent<T extends EventType>(type: T, data: EventPayloadMap[T]) {
    return { type, data, at: nowISO() } as const
  }

  // emit
  emit<T extends EventType>(channel: EventChannel, type: T, data: EventPayloadMap[T]) {
    const bucket = this.channels.get(channel)
    if (!bucket || bucket.size === 0) return

    const message = this.makeEvent(type, data)

    for (const [id, client] of bucket) {
      try {
        client.res.write(`data: ${JSON.stringify(message)}\n\n`)
      } catch {
        bucket.delete(id)
      }
    }

    if (bucket.size === 0) this.channels.delete(channel)
  }

  getClientCount(channel?: EventChannel) {
    if (!channel) {
      let total = 0
      for (const [, bucket] of this.channels) total += bucket.size
      return total
    }
    return this.channels.get(channel)?.size ?? 0
  }

  getChannels() {
    return Array.from(this.channels.keys())
  }

  private getOrCreateBucket(channel: EventChannel) {
    const existing = this.channels.get(channel)
    if (existing) return existing

    const bucket = new Map<string, Client>()
    this.channels.set(channel, bucket)
    return bucket
  }
}
