import * as IORedis from 'ioredis';
import {logger} from "@application/logger";

/**
 * RedisRepository
 * @class
 */
export class RedisDriver {
  private client: IORedis.Redis | IORedis.Cluster;
  private status: ConnectionStatus = ConnectionStatus.READY;

  /**
   * @constructor
   * @param {IORedis.Redis} client
   */
  private constructor(client: IORedis.Redis | IORedis.Cluster) {
    this.client = client;


    this.client.on('connect', () => {
      this.status = ConnectionStatus.CONNECTED
    });

    this.client.on('error', () => {
      this.status = ConnectionStatus.ERROR
    });

    this.client.on('reconnecting', () => {
      this.status = ConnectionStatus.RECONNECT
    });
  }

  /**
   * alive
   */
  public alive(): boolean {
    return (this.status === ConnectionStatus.CONNECTED)
  }

  /**
   * get
   * @param {string} key
   */
  public async get(key: string): Promise<string | null> {
    if (!this.alive()) {
      logger.error({message: 'Cannot read because connection is not possible'});
      return null;
    }

    try {
      return await this.client.get(key);
    } catch (e) {
      logger.error({message: e.message});
      return null;
    }
  }

  /**
   * set
   * @param {string} key
   * @param {any} value
   * @param {number} expireSec
   */
  public set(key: string, value: any, expireSec: number): void {
    if (!this.alive()) {
      logger.error({message: 'Cannot write because connection is not possible'});
      return;
    }

    this.client.set(key, value, 'EX', expireSec).then(() => {
    }).catch((e) => {
      logger.error({message: e.message});
    });
  }

  /**
   * clusterMode
   * @param {ClusterConnectionConfig} config
   */
  public static clusterMode(config: ClusterConnectionConfig): RedisDriver {
    return new RedisDriver(new IORedis.Cluster(config.clusters, {
      redisOptions: {
        password: config.password
      }
    }));
  }

  /**
   * singleMode
   * @param {SingleConnectionConfig} singleConfig
   */
  public static singleMode(singleConfig: SingleConnectionConfig): RedisDriver {
    return new RedisDriver(new IORedis(singleConfig));
  }
}


/**
 * SingleConnectionConfig
 * @interface
 */
interface SingleConnectionConfig {
  port: number;
  host: string;
  password?: string;
}

/**
 * ClusterConnectionConfig
 * @interface
 */
interface ClusterConnectionConfig {
  clusters: Array<{port: number, host: string}>
  password?: string
}

enum ConnectionStatus {
  READY,
  CONNECTED,
  ERROR,
  RECONNECT
}