import * as fastify from "fastify";
import {Resource} from "@application/type/resource";
import {RequestHandler} from "fastify";
import {ResponseVo} from "@application/../domain/vo/responseVo";
import {backPostService} from "@application/service/BackPostService";
import {RequestVo} from "@domain/vo/requestVo";

/**
 * Proxy
 * @class
 */
export class Proxy {
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
    const response: ResponseVo = await backPostService.exec(RequestVo.createFromFastify(req, this.proxyMap));

    res.headers(Object.entries(response.header));
    res.send(response.data);
  }
}