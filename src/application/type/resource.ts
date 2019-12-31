/**
 * Resource
 * @type
 */
export type Resource = {
  prefix: string
  upstream: string
  expire: number
  circuitBreaker: {
    activeSpanMs: number
    threshold: number
  }
}
