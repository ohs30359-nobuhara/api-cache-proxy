import { get } from 'config';
import {CircuitBreaker} from "@domain/mocel/circuitBreaker";

/**
 * CircuitBreakerService
 * @class
 */
export class CircuitBreakerService {
  private storage: Map<string, CircuitBreaker>;
  private config: Map<string, CircuitBreakerConfig>;

  /**
   * @constructor
   */
  public constructor() {
    this.storage = new Map();
    this.config = new Map();

    (get('resources') as any[] || []).forEach(conf => {
      this.config.set(conf.upstream, {
        activeSpanMs: conf.circuitBreaker.activeSpanMs,
        threshold: conf.circuitBreaker.threshold
      });
    });
  }

  /**
   * checkHost
   * @param host
   */
  public checkHost(host: string): boolean {
    const c: CircuitBreaker = this.loadCircuitBreaker(host);
    return c.execTriggerCheck();
  }

  /**
   * loadCircuitBreaker
   * @param host
   */
  private loadCircuitBreaker(host: string): CircuitBreaker {
    const c: CircuitBreakerConfig | undefined = this.config.get(host);

    if (c === undefined) {
      throw Error;
    }

    if(this.storage.has(host)) {
      return this.storage.get(host) as CircuitBreaker;
    }

    return new CircuitBreaker(host, c.threshold, c.activeSpanMs);
  }
}

/**
 * CircuitBreakerConfig
 * @interface
 */
interface CircuitBreakerConfig {
  threshold: number
  activeSpanMs: number
}

