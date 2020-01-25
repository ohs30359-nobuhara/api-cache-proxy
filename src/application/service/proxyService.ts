import * as fastify from "fastify";
import {Resource} from "../type/resource";
import {RequestHandler} from "fastify";
import {ResponseVo} from "@domain/vo/responseVo";
import {RequestVo} from "@domain/vo/requestVo";
import {backPostService} from "@application/service/backPostService";

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
    const responseVo: ResponseVo = await backPostService.exec(requestVo, true);

    res.status(responseVo.status);
    res.headers(Object.entries(responseVo.header));
    res.send(responseVo.data);
  }
}