import { get } from 'config';
import * as fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import {Resource} from "@application/type/resource";
import {ProxyService} from "@application/service/proxyService";
import {logger} from "@application/logger";
import {circuitBreakerService} from "@application/service/circuitBreakerService";
import {CircuitBreaker} from "@domain/model/circuitBreaker";
import {RequestHandler} from "fastify";

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
   * circuitBreakerForceControl
   * @param req
   * @param res
   */
  private circuitBreakerForceControl: RequestHandler = async (req, res) => {
    const query: { active: boolean, upstream: string } = req.query as any;
    const cb: CircuitBreaker = await circuitBreakerService.loadCircuitBreaker(query.upstream);

    query.active? cb.forceEffectiveness() : cb.forceInvalid();

    circuitBreakerService.resist(cb);

    res.send(true);
  }

  /**
   * run
   */
  public run() {
    const svc: ProxyService = new ProxyService(this.server, this.resources);
    svc.activate();

    this.server.listen(3000, () => {
      logger.info({message: 'server running'});
    });

    this.server.post('/system/circuitBreaker/forceMode', this.circuitBreakerForceControl);
  }
}