import * as fastify from "fastify";
import {Resource} from "../type/resource";
import {RequestHandler} from "fastify";
import {ResponseVo} from "@domain/vo/responseVo";
import {RequestVo} from "@domain/vo/requestVo";
import {backPostService} from "@application/service/backPostService";
import {cacheService} from "@application/service/cacheService";
import {logger} from "@application/logger";
import {circuitBreakerService} from "@application/service/circuitBreakerService";
import {CircuitBreaker} from "@domain/mocel/circuitBreaker";

/**
 * ProxyService
 * @class
 */
export class ProxyService {
  private readonly server: fastify.FastifyInstance;
  private readonly resources: Resource[];
  private readonly proxyMap: Map<string, Resource>;

  /**
   * @constructor
   * @param server
   * @param resources
   */
  public constructor(server: fastify.FastifyInstance, resources: Resource[]) {
    this.server = server;
    this.resources = resources;
    this.proxyMap = new Map();
  }

  /**
   * activate
   */
  public activate() {
    this.resources.forEach(r => {
      this.proxyMap.set(`/${r.prefix}`, r);
      this.server.get(`/${r.prefix}`, this.handler);
    })
  }

  /**
   * handler
   * @param req
   * @param res
   */
  private handler: RequestHandler = async (req, res) => {
    const requestVo: RequestVo = RequestVo.createFromFastify(req, this.proxyMap);

    // cacheが存在するなら cacheを返す
    const cacheResponseVo: ResponseVo | null = await cacheService.read(requestVo);

    if (cacheResponseVo != null) {
      logger.info({ message: `cache hit ${requestVo.getFullUrl()}` });
      res.headers(Object.entries(cacheResponseVo.header));
      res.send(cacheResponseVo.data);

      return;
    }

    logger.info({ message: `cache no hit ${requestVo.getFullUrl()}` });

    // CircuitBreakerが有効ならリクエストを停止
    const cb: CircuitBreaker = await circuitBreakerService.loadCircuitBreaker(requestVo.url);

    if(cb.isActive()) {
      res.status(500);
      res.send('Invalidating the request due to a problem with the proxy API');

      logger.info({message: `${cb.host} is active circuitBreaker`});
      return;
    }


    // それ以外は新規に取得する
    const responseVo: ResponseVo = await backPostService.exec(RequestVo.createFromFastify(req, this.proxyMap));

    // Errorが発生した場合は サーキットブレーカに登録
    if (responseVo.status === 500) {
      circuitBreakerService.resist(cb);
    } else {
      // 正常時のみcacheに書き込み
      cacheService.write(requestVo, responseVo);
    }

    res.status(responseVo.status);
    res.headers(Object.entries(responseVo.header));
    res.send(responseVo.data);
  }
}