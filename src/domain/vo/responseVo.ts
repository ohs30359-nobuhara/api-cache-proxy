import {AxiosResponse} from "axios";

/**
 *
 * ResponseVo
 * @type
 */
export class ResponseVo {
  public readonly data: any
  public readonly status: number;
  public readonly header: Map<string, any>

  /**
   * @constructor
   * @param data
   * @param header
   */
  public constructor(data: any, status: number, header: any) {
    this.data = data;
    this.header = header;
    this.status = status;
  }

  /**
   * createFromAxsios
   * @param response
   */
  public static createFromAxsios(response: AxiosResponse): ResponseVo {
    return new ResponseVo(response.data, response.status, response.headers);
  }

  /**
   * createError
   * @param e
   * @param status
   */
  public static createError(e: Error, status: number = 500): ResponseVo {
    return new ResponseVo(e.message, status, {});
  }
}