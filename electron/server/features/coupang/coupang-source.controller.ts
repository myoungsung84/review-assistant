import type http from 'node:http'

import { badRequest } from '@e/server/lib/errors'
import { readJsonBody, sendSuccess } from '@e/server/transport'

import { parseCoupangPublishPayload } from './coupang-source.schema'
import type { CoupangSourceService } from './coupang-source.service'

export class CoupangSourceController {
  constructor(private readonly service: CoupangSourceService) {}

  publishProduct = async (req: http.IncomingMessage, res: http.ServerResponse) => {
    const body = await readJsonBody(req)
    const parsed = parseCoupangPublishPayload(body)

    if (!parsed.ok) {
      return badRequest('Invalid payload')
    }

    const result = await this.service.publishProduct(parsed.value)
    return sendSuccess(res, result)
  }
}
