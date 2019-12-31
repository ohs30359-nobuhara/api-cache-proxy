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
    const response: ResponseVo = await httpRepository.fetch(req);

    return response;
  }
}

export const backPostService: BackPostService = new BackPostService();