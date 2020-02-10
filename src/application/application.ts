import { get } from 'config';
import * as fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import {Resource} from "@application/type/resource";
import {ProxyService} from "@application/service/proxyService";
import {logger} from "@application/logger";
import * as prometheus from 'fastify-metrics';
import {registry} from "@application/metrics/metricsExporter";
import {cacheMetrics} from "@application/metrics/cacheMetrics";

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

    this.server.register(prometheus, {
      endpoint: '/metrics', register: registry
    });

    this.server.get('/favicon.ico', (_, res) =>{
      cacheMetrics.hit('sample');
      res.status(200);
      res.send();
    });

    this.server.listen(3000, () => {
      logger.info({message: 'server running'});
    });
  }
}