export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message?: string) {
    super(message ?? code)
    this.status = status
    this.code = code
  }
}

export const badRequest = (code = 'bad_request'): never => {
  throw new ApiError(400, code)
}

export const unauthorized = (code = 'unauthorized'): never => {
  throw new ApiError(401, code)
}

export const forbidden = (code = 'forbidden'): never => {
  throw new ApiError(403, code)
}

export const notFound = (code = 'not_found'): never => {
  throw new ApiError(404, code)
}

export const methodNotAllowed = (code = 'method_not_allowed'): never => {
  throw new ApiError(405, code)
}

export const internalError = (code = 'internal_error'): never => {
  throw new ApiError(500, code)
}
