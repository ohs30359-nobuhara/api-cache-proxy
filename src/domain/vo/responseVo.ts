import {AxiosResponse} from "axios";

/**
 *
 * ResponseVo
 * @type
 */
export class ResponseVo {
  public readonly data: any
  public readonly header: Map<string, any>

  /**
   * @constructor
   * @param data
   * @param header
   */
  public constructor(data: any, header: any) {
    this.data = data;
    this.header = header;
  }

  /**
   * createFromAxsios
   * @param response
   */
  public static createFromAxsios(response: AxiosResponse): ResponseVo {
    return new ResponseVo(response.data, response.headers);
  }
}