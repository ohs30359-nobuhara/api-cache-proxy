import * as fastify from "fastify";
import {Resources} from "@application/type/resources";
import {proxy} from "@application/proxy";

/**
 * Service
 * @class
 */
export class Service {
  private readonly server: fastify.FastifyInstance;
  private readonly resources: Resources[];

  /**
   * @constructor
   * @param server
   * @param resources
   */
  public constructor(server: fastify.FastifyInstance, resources: Resources[]) {
    this.server = server;
    this.resources = resources;
  }

  /**
   * activate
   */
  public activate() {
    this.resources.forEach(r => {
      this.server.get(r.prefix, proxy);
    })
  }
}