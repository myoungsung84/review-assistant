import type http from 'node:http'

import type { Middleware } from '@e/server/types/router.types'

const DEV_ORIGINS = new Set(['http://localhost:5173', 'http://127.0.0.1:5173'])

const DEV_EXTENSION_IDS = new Set<string>([
  // 'abcdefghijklmnopabcdefghijklmnop',
])

function isAllowedExtensionOrigin(origin: string) {
  // chrome-extension://<id>
  const m = /^chrome-extension:\/\/([a-p]{32})$/i.exec(origin)
  if (!m) return false

  if (DEV_EXTENSION_IDS.size === 0) return true
  return DEV_EXTENSION_IDS.has(m[1].toLowerCase())
}

function isAllowedOrigin(origin: string) {
  return DEV_ORIGINS.has(origin) || isAllowedExtensionOrigin(origin)
}

export function corsMiddleware(): Middleware {
  return async (req: http.IncomingMessage, res: http.ServerResponse, _ctx, next) => {
    const origin = req.headers.origin
    const method = (req.method ?? '').toUpperCase()

    const originOk = typeof origin === 'string' && isAllowedOrigin(origin)

    if (originOk && typeof origin === 'string') {
      res.setHeader('Access-Control-Allow-Origin', origin)
      res.setHeader('Vary', 'Origin')

      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-App-Token')
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    }

    if (method === 'OPTIONS') {
      if (!originOk) {
        res.statusCode = 403
        res.end()
        return
      }
      res.statusCode = 204
      res.end()
      return
    }

    await next()
  }
}
