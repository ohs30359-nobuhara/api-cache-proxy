import { get } from 'config';
import * as fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import {Resource} from "@application/type/resource";
import {ProxyService} from "@application/service/proxyService";

/**
 * Application
 * @class
 */
export class Application {
  private readonly server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>;
  private readonly resources: Resource[];

  /**
   * @constructor
   */
  public constructor() {
    this.server =  fastify({});
    this.resources = get('resources');
  }

  /**
   * run
   */
  public run() {
    const svc: ProxyService = new ProxyService(this.server, this.resources);
    svc.activate();

    this.server.listen(3000, () => {
      console.log('server start');
    });
  }
}