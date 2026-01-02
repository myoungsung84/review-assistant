import type http from 'node:http'

import type { Middleware } from '@e/server/types/router.types'

export function corsMiddleware(): Middleware {
  return async (req: http.IncomingMessage, res: http.ServerResponse, _ctx, next) => {
    const origin = req.headers.origin
    if (typeof origin === 'string' && origin.startsWith('chrome-extension://')) {
      res.setHeader('Access-Control-Allow-Origin', origin)
      res.setHeader('Vary', 'Origin')
    }

    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-App-Token')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')

    if ((req.method ?? '').toUpperCase() === 'OPTIONS') {
      res.statusCode = 204
      res.end()
      return
    }

    await next()
  }
}
