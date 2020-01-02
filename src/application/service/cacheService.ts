import {get} from "config";
import {redisRepository} from "@infrastructure/redisRepository";
import {RequestVo} from "@domain/vo/requestVo";
import {ResponseVo} from "@domain/vo/responseVo";

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
        expire: conf.expireSec
      });
    });
  }

  /**
   * read
   * @param vo
   */
  public async read(vo: RequestVo): Promise<ResponseVo|null> {
    const cache: string | null = await redisRepository.read(vo.getFullUrl());

    if (cache == null) {
      return null;
    }

    return JSON.parse(cache);
  }

  /**
   * write
   * @param requestVo
   * @param responseVo
   */
  public async write(requestVo: RequestVo, responseVo: ResponseVo): Promise<void> {
    const c: CacheConfig | undefined = this.config.get(requestVo.url);
    const expire: number = c? c.expire : 60;
    redisRepository.set(requestVo.getFullUrl(), JSON.stringify(responseVo), expire);
  }
}

/**
 * CacheConfig
 * @interface
 */
interface CacheConfig {
  expire: number
}

export const cacheService: CacheService = new CacheService();