import {RequestVo} from "@domain/vo/requestVo";
import {httpRepository} from "@infrastructure/httpRepository";
import {ResponseVo} from "@domain/vo/responseVo";

/**
 * BackPostService
 * @class
 */
export class BackPostService {
  /**
   * exec
   * @param req
   */
  public async exec(req: RequestVo): Promise<ResponseVo> {
    try {
      return await httpRepository.fetch(req);
    } catch (e) {
      return ResponseVo.createError(e);
    }
  }
}

export const backPostService: BackPostService = new BackPostService();