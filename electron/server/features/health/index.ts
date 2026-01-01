import type { Router } from '@e/server/types/router.types'
import { HealthController } from './health-controller'
import { HealthService } from './health-service'

export function healthRoutes(r: Router) {
  const service = new HealthService()
  const controller = new HealthController(service)

  r.get('/health', controller.check)
}
