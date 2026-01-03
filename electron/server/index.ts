import http from 'node:http'
import type net from 'node:net'

import { buildRouter } from './router'

export interface ServerInfo {
  port: number
  baseUrl: string
}

let server: http.Server | null = null
let port: number | null = null

const sockets = new Set<net.Socket>()

export function getServerInfo(): ServerInfo {
  if (!port) throw new Error('server not started')
  return {
    port,
    baseUrl: `http://127.0.0.1:${port}`,
  }
}

export async function startApiServer(): Promise<ServerInfo> {
  const apiPort = 17355
  if (server) return getServerInfo()

  const router = buildRouter()

  server = http.createServer((req, res) => {
    void router.handle(req, res)
  })

  server.on('connection', socket => {
    sockets.add(socket)
    socket.on('close', () => sockets.delete(socket))
  })

  await new Promise<void>((resolve, reject) => {
    const onError = (err: unknown) => {
      server?.off('listening', onListening)
      reject(err)
    }
    const onListening = () => {
      server?.off('error', onError)
      resolve()
    }

    server!.once('error', onError)
    server!.once('listening', onListening)
    server!.listen(apiPort, '127.0.0.1')
  })

  const addr = server.address()
  if (!addr || typeof addr === 'string') {
    throw new Error('failed to bind server')
  }

  port = addr.port
  console.log(`[api] listening http://127.0.0.1:${port}`)

  return getServerInfo()
}

export async function stopApiServer(): Promise<void> {
  const s = server
  server = null
  port = null
  if (!s) return

  await new Promise<void>(resolve => {
    const timeout = setTimeout(() => {
      for (const sock of sockets) sock.destroy()
      resolve()
    }, 1500)

    s.close(() => {
      clearTimeout(timeout)
      resolve()
    })

    // keep-alive 소켓 즉시 정리
    for (const sock of sockets) sock.destroy()
  })
}
