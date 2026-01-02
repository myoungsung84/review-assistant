import http from 'node:http'

import { corsMiddleware } from './middlewares/cors'
import { buildRouter } from './router'

let server: http.Server | null = null
let port: number | null = null

export type ServerInfo = {
  port: number | null
  baseUrl: string | null
}

export function getServerInfo(): ServerInfo {
  return { port, baseUrl: port ? `http://127.0.0.1:${port}` : null }
}

export async function startApiServer(): Promise<ServerInfo> {
  const apiPort = 17355

  if (server) return getServerInfo()

  const router = buildRouter()

  // middleware chain (순서 중요)
  router.use(corsMiddleware())

  server = http.createServer((req, res) => {
    void router.handle(req, res)
  })

  await new Promise<void>((resolve, reject) => {
    server!.once('error', reject)
    server!.listen(apiPort, '127.0.0.1', () => resolve())
  })

  const addr = server.address()
  if (!addr || typeof addr === 'string') throw new Error('failed to bind server')

  port = addr.port
  console.log(`[api] listening http://127.0.0.1:${port}`)

  return getServerInfo()
}

export async function stopApiServer(): Promise<void> {
  const s = server
  server = null
  port = null
  if (!s) return

  await new Promise<void>(resolve => s.close(() => resolve()))
}
