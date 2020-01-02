import * as fastify from "fastify";
import {Resource} from "../type/resource";
import {RequestHandler} from "fastify";
import {ResponseVo} from "@domain/vo/responseVo";
import {RequestVo} from "@domain/vo/requestVo";
import {backPostService} from "@application/service/backPostService";
import {cacheService} from "@application/service/cacheService";
import {logger} from "@application/logger";

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

    // それ以外は新規に取得する
    const responseVo: ResponseVo = await backPostService.exec(RequestVo.createFromFastify(req, this.proxyMap));
    cacheService.write(requestVo, responseVo);

    console.log('error?');

    res.status(responseVo.status);
    res.headers(Object.entries(responseVo.header));
    res.send(responseVo.data);
  }
}