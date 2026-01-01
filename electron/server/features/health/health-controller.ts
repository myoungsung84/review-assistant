import type http from 'node:http'
import { sendSuccess } from '@e/server/transport'
import type { HealthService } from './health-service'

export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  check = async (_req: http.IncomingMessage, res: http.ServerResponse) => {
    const result = await this.healthService.check()
    sendSuccess(res, result)
  }
}
