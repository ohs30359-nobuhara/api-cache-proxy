import {RedisDriver} from "@infrastructure/driver/redisDriver";

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
    this.driver = RedisDriver.singleMode({port: 3000, host: 'localhost:6379'})
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
}

export const redisRepository: RedisRepository = new RedisRepository();