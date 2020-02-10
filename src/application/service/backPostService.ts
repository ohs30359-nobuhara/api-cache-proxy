import {RequestVo} from "@domain/vo/requestVo";
import {httpRepository} from "@infrastructure/httpRepository";
import {ResponseVo} from "@domain/vo/responseVo";
import {cacheService} from "@application/service/cacheService";
import {CircuitBreaker} from "@domain/model/circuitBreaker";
import {circuitBreakerService} from "@application/service/circuitBreakerService";
import {cacheMetrics} from "@application/metrics/cacheMetrics";

/**
 * BackPostService
 * @class
 */
export class BackPostService {
  /**
   * exec
   * @param requestVo
   * @param circuitBreak
   */
  public async exec(requestVo: RequestVo, circuitBreak: boolean): Promise<ResponseVo> {
    const cache: ResponseVo | null = await cacheService.read(requestVo);

    // cache存在時は cacheを返す
    if (cache !== null) {
      cacheMetrics.hit(requestVo.url);
      return cache;
    }

    cacheMetrics.nonHit(requestVo.url);

    const responseVo: ResponseVo = (circuitBreak)?
      await this.requestUseCircuitBreak(requestVo) : await httpRepository.fetch(requestVo);

    // 200系なら cacheに書き込む
    if (responseVo.status == 200) {
      cacheService.write(requestVo, responseVo);
    }

    return responseVo;
  }

  /**
   * requestProxyCircuitBreak
   * @param requestVo
   */
  private async requestUseCircuitBreak(requestVo: RequestVo): Promise<ResponseVo> {
    const cb: CircuitBreaker = await circuitBreakerService.loadCircuitBreaker(requestVo.url);

    // circuitBreaker有効時は エラーで返す
    if (cb.isActive()) {
      return ResponseVo.createError(Error("The request is blocked because a problem has occurred at the proxy destination"));
    }

    const responseVo: ResponseVo = await httpRepository.fetch(requestVo);

    // 500系エラーなら  circuitBreakerに登録
    if (responseVo.status >= 500) {
      circuitBreakerService.resist(cb);
    }

    return responseVo;
  }
}

export const backPostService: BackPostService = new BackPostService();