import {HttpDriver} from "@infrastructure/driver/httpDriver";
import {Response} from "@application/type/response";
import {Request} from "@application/type/request";

/**
 * Repository
 * @class
 */
class Repository {
  /**
   * fetch
   * @param request
   */
  public async fetch(request: Request): Promise<Response> {
    const driver: HttpDriver = new HttpDriver();
    return await driver.get(request);
  }
}

export const repository: Repository = new Repository();