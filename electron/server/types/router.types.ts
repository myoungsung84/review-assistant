import type http from 'node:http'

export type Ctx = {
  params: Record<string, string>
  state: Record<string, unknown>
}

export type Handler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  ctx: Ctx,
) => Promise<void> | void

export type Middleware = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  ctx: Ctx,
  next: () => Promise<void>,
) => Promise<void>

export type Router = {
  use: (mw: Middleware) => void
  get: (path: string, h: Handler) => void
  post: (path: string, h: Handler) => void
  put: (path: string, h: Handler) => void
  del: (path: string, h: Handler) => void
  handle: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>
}
