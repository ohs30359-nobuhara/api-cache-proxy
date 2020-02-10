import {Counter} from "prom-client";
/**
 * CacheMetrics
 * @class
 */
class CacheMetrics {
  public readonly metrics: Counter;

  /**
   * @constructor
   */
  constructor() {
    this.metrics = new Counter({
      name: "cache_metrics",
      help: "cache hit check",
      labelNames: ["path", "status"]
    });
  }

  /**
   * hit
   * @param path
   */
  hit(path: string): void {
    this.metrics.labels(path, 'true').inc();
  }

  /**
   * nonHit
   * @param path
   */
  nonHit(path: string): void {
    this.metrics.labels(path, 'false').inc();
  }
}

export const cacheMetrics: CacheMetrics = new CacheMetrics();