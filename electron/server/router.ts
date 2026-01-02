import { registerFeatureRoutes } from '@e/server/features'
import { ApiError, badRequest, internalError, notFound } from '@e/server/lib/errors'
import { sendError } from '@e/server/transport/response'
import type { Ctx, Handler, Middleware, Router } from '@e/server/types/router.types'

import { EventHub } from './transport/event-hub'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS'
type RouteMethod = Exclude<HttpMethod, 'OPTIONS'>
type RouteKey = `${RouteMethod} ${string}`

export function buildRouter(): Router {
  const routes = new Map<RouteKey, Handler>()
  const methodsByPath = new Map<string, Set<RouteMethod>>()
  const middlewares: Middleware[] = []

  const addRoute = (method: RouteMethod, path: string, h: Handler) => {
    routes.set(`${method} ${path}`, h)

    const set = methodsByPath.get(path) ?? new Set<RouteMethod>()
    set.add(method)
    methodsByPath.set(path, set)
  }

  const router: Router = {
    use(mw) {
      middlewares.push(mw)
    },

    get(path, h) {
      addRoute('GET', path, h)
    },
    post(path, h) {
      addRoute('POST', path, h)
    },
    put(path, h) {
      addRoute('PUT', path, h)
    },
    del(path, h) {
      addRoute('DELETE', path, h)
    },

    async handle(req, res) {
      try {
        const method = (req.method ?? 'GET').toUpperCase() as HttpMethod
        const url = new URL(req.url ?? '/', 'http://localhost')
        const pathname = url.pathname

        if (method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }

        const key = `${method} ${pathname}` as RouteKey
        const handler = routes.get(key)

        if (!handler) {
          if (methodsByPath.has(pathname)) {
            throw badRequest('method_not_allowed')
          }
          throw notFound()
        }

        const ctx: Ctx = { params: {}, state: {} }

        let idx = -1
        const dispatch = async (i: number): Promise<void> => {
          if (i <= idx) {
            throw internalError(`next() called multiple times: ${method} ${pathname}`)
          }
          idx = i

          const mw = middlewares[i]
          if (!mw) {
            return await handler(req, res, ctx)
          }
          await mw(req, res, ctx, () => dispatch(i + 1))
        }

        await dispatch(0)
      } catch (err) {
        if (res.writableEnded) return

        if (err instanceof ApiError) {
          return sendError(res, err.status, err.code)
        }

        console.error('[api] unhandled error', err)
        sendError(res, 500, 'internal_error')
      }
    },
  }

  // register controllers
  const eventHub = new EventHub()
  registerFeatureRoutes(router, { eventHub })

  return router
}
