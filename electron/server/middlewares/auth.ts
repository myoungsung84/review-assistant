import type http from 'node:http'
import type { Middleware } from '@e/server/types/router.types'
import { sendError } from '@e/server/transport/response'

export function authMiddleware(params: { token: string }): Middleware {
  return async (req: http.IncomingMessage, res: http.ServerResponse, _ctx, next) => {
    const got = req.headers['x-app-token']
    if (typeof got !== 'string' || got !== params.token) {
      sendError(res, 401, 'unauthorized')
      return
    }
    await next()
  }
}
