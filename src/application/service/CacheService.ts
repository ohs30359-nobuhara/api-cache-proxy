import {get} from "config";
import {redisRepository} from "@infrastructure/redisRepository";

/**
 * CacheService
 * @class
 */
export class CacheService {
  private config: Map<string, CacheConfig>;

  /**
   * @constructor
   */
  public constructor() {
    this.config = new Map();

    (get('resources') as any[] || []).forEach(conf => {
      this.config.set(conf.upstream, {
        expire: conf.expire
      });
    });
  }

  public async read(host: string, queryParam: any): Promise<string> {
    return await redisRepository.read(host) || '';
  }

  public async write(host: string, qp: any, value: any): Promise<void> {
    //TODO: queryParamでcacheするように変更
    const c: CacheConfig | undefined = this.config.get(host);
    const expire: number = c? c.expire : 60;
    redisRepository.set(host, value, expire);
  }
}

/**
 * CacheConfig
 * @interface
 */
interface CacheConfig {
  expire: number
}