import { get } from 'config';
import {CircuitBreaker} from "@domain/mocel/circuitBreaker";
import {RedisRepository, redisRepository} from "@infrastructure/redisRepository";

/**
 * CircuitBreakerService
 * @class
 */
export class CircuitBreakerService {
  private storage: RedisRepository;
  private config: Map<string, CircuitBreakerConfig>;

  /**
   * @constructor
   */
  public constructor() {
    this.storage = redisRepository;
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
  public async checkHost(host: string): Promise<boolean> {
    const c: CircuitBreaker = await this.loadCircuitBreaker(host);
    return c.execTriggerCheck();
  }

  /**
   * loadCircuitBreaker
   * @param host
   */
  private async loadCircuitBreaker(host: string): Promise<CircuitBreaker> {
    const c: CircuitBreakerConfig | undefined = this.config.get(host);

    if (c === undefined) {
      throw Error;
    }

    const val: string | null  = await this.storage.read(host);

    if (val == null) {
      const cb: CircuitBreaker = new CircuitBreaker(host, c.threshold);
      this.storage.set(JSON.stringify(cb), c.activeSpanMs);
      return new CircuitBreaker(host, c.threshold);
    }

    return JSON.parse(val);
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

