/**
 * Resource
 * @type
 */
export type Resource = {
  prefix: string
  upstream: string
  expireSec: number
  timeoutMs: number
  circuitBreaker: {
    activeSpanSec: number
    threshold: number
  }
}
