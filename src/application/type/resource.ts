/**
 * Resource
 * @type
 */
export type Resource = {
  prefix: string
  upstream: string
  expire: number
  timeoutMs: number
  circuitBreaker: {
    activeSpanMs: number
    threshold: number
  }
}
