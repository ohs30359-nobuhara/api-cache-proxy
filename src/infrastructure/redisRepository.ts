import {RedisDriver} from "@infrastructure/driver/redisDriver";
import {get} from "config";
import {ClusterRedis, SingleRedis} from "@application/type/redis";

/**
 * RedisRepository
 * @class
 */
export class RedisRepository {
  private driver: RedisDriver;

  /**
   * @constructor
   */
  public constructor() {
    this.driver = this.loadSingleRedis();
  }

  /**
   * read
   * @param key
   */
  public async read(key: string): Promise<string | null> {
    return await this.driver.get(key) || null
  }

  /**
   * set
   * @param key
   * @param value
   * @param expire
   */
  public async set(key: string, value: any, expire: number = 30) {
    this.driver.set(key, value, expire);
  }

  /**
   * loadSingleRedis
   */
  protected loadSingleRedis(): RedisDriver {
    const redisConfig: SingleRedis = get('redis.single');
    const conf: string[] = redisConfig.node.split(':');

    const host: string = conf[0];
    const port: number = +conf[1];

    return RedisDriver.singleMode({port, host})
  }

  /**
   * loadClusterRedis
   */
  protected loadClusterRedis(): RedisDriver {
    const redisConfig: ClusterRedis = get('redis.multi');

    const clusters: Array<{host: string, port: number}> = redisConfig.nodes.map(node => {
      const conf: string[] = node.split(':');
      return {
        host: conf[0],
        port: +conf[1]
      }
    });

    return RedisDriver.clusterMode({clusters})
  }
}

export const redisRepository: RedisRepository = new RedisRepository();