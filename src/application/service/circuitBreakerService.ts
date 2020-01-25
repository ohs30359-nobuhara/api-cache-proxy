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
        activeSpanMs: conf.circuitBreaker.activeSpanSec,
        threshold: conf.circuitBreaker.threshold
      });
    });
  }

  /**
   * loadCircuitBreaker
   * @param host
   */
  public async loadCircuitBreaker(host: string): Promise<CircuitBreaker> {
    const c: CircuitBreakerConfig | undefined = this.config.get(host);

    if (c === undefined) {
      throw Error;
    }

    const val: string | null  = await this.storage.read(this.createKey(host));

    if (val == null) {
      return new CircuitBreaker(host, c.threshold, c.activeSpanMs);
    }

    return CircuitBreaker.createFromJson(JSON.parse(val));
  }

  /**
   * resist
   * @param cb
   */
  public async resist(cb: CircuitBreaker): Promise<void> {
    cb.countUp();
    this.storage.set(this.createKey(cb.host), JSON.stringify(cb), cb.activeSpanSec);
  }

  private createKey(host: string): string {
    return `CircuitBreaker:${host}`;
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

export const circuitBreakerService: CircuitBreakerService = new CircuitBreakerService();