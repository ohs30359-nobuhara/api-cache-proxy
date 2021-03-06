import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import {RequestVo} from "@domain/vo/requestVo";
import {ResponseVo} from "@domain/vo/responseVo";

/**
 * HttpDriver
 * @class
 */
export class HttpDriver {
  /**
   * get
   * @param request
   */
  public async get(request: RequestVo): Promise<ResponseVo> {
    try {
      const response: AxiosResponse = await axios(this.convertFromRequest(request));
      return this.convertFromResponse(response);

    } catch (e) {
      return this.convertFromAxiosError(e);
    }
  }

  /**
   * convertFromRequest
   * @param {RequestVo} request
   */
  private convertFromRequest(request: RequestVo): AxiosRequestConfig {
    const c: AxiosRequestConfig = {
      url: request.url
    };

    if (request.query != null) {
      c.params = request.query
    }

    if (request.timeout !== undefined) {
      c.timeout = request.timeout;
    }

    if (request.headers !== undefined) {
      c.headers = request.headers;
    }

    return c;
  }

  /**
   * convertFromResponse
   * @param response
   */
  private convertFromResponse(response: AxiosResponse): ResponseVo {
    return ResponseVo.createFromAxsios(response);
  }

  /**
   * convertFromAxiosError
   * @param error
   */
  private convertFromAxiosError(error: AxiosError): ResponseVo {
    const response: AxiosResponse | undefined = error.response;

    if (response === undefined) {
      return ResponseVo.createError(error);
    }

    return ResponseVo.createError(error, response.status);
  }
}
