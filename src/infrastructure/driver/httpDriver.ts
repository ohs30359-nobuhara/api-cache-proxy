import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {Response} from "@application/type/response";
import {Request} from "@application/type/request";

/**
 * HttpDriver
 * @class
 */
export class HttpDriver {
  /**
   * get
   * @param request
   */
  public async get(request: Request): Promise<Response> {
    const response: AxiosResponse = await axios(this.convertFromRequest(request));
    return this.convertFromResponse(response);
  }

  /**
   * convertFromRequest
   * @param {Request} request
   */
  private convertFromRequest(request: Request): AxiosRequestConfig {
    const c: AxiosRequestConfig = {
      url: request.url
    };

    if (request.timeout !== undefined) {
      c.timeout = request.timeout;
    }

    if (request.headers !== undefined) {
      c.headers = request.headers;
    }

    return c;
  }

  /**
   * convertFromResponse(
   * @param response
   */
  private convertFromResponse(response: AxiosResponse): Response {
    return {
      data: response.data,
      header: response.headers
    }
  }

}
