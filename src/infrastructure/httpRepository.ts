import {HttpDriver} from "@infrastructure/driver/httpDriver";
import {ResponseVo} from "@application/../domain/vo/responseVo";
import {RequestVo} from "@application/../domain/vo/requestVo";

/**
 * HttpRepository
 * @class
 */
class HttpRepository {
  private driver: HttpDriver;

  /**
   * @constructor
   */
  constructor() {
    this.driver = new HttpDriver();
  }
  /**
   * fetch
   * @param request
   */
  public async fetch(request: RequestVo): Promise<ResponseVo> {
    try {
      return await this.driver.get(request);
    } catch (e) {
      return ResponseVo.createError(e);
    }
  }
}

export const httpRepository: HttpRepository = new HttpRepository();