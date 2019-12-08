import { get } from 'config';
import * as fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import {Resources} from "@application/type/resources";
import {Service} from "@application/service";

/**
 * Application
 * @class
 */
export class Application {
  private readonly server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>;
  private readonly resources: Resources[];

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
    const svc: Service = new Service(this.server, this.resources);
    svc.activate();

    this.server.listen(3000, () => {
      console.log('server start');
    });
  }
}