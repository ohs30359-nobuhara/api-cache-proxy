import * as fastify from "fastify";
import {Resource} from "../type/resource";
import {RequestHandler} from "fastify";
import {ResponseVo} from "@domain/vo/responseVo";
import {RequestVo} from "@domain/vo/requestVo";
import {backPostService} from "@application/service/BackPostService";
import {cacheService} from "@application/service/CacheService";

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
      res.headers(Object.entries(cacheResponseVo.header));
      res.send(cacheResponseVo.data);
      return;
    }

    // それ以外は新規に取得する
    const response: ResponseVo = await backPostService.exec(RequestVo.createFromFastify(req, this.proxyMap));
    cacheService.write(requestVo, response);

    res.headers(Object.entries(response.header));
    res.send(response.data);
  }
}