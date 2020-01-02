import {Resource} from "@application/type/resource";
import {stringify} from "query-string";
/**
 * RequestVo
 * @class
 */
export class RequestVo {
  public readonly url: string;
  public readonly headers?: any;
  public readonly query: any;
  public readonly timeout?: number;

  /**
   * @constructor
   * @param url
   * @param query
   * @param headers
   * @param timeout
   */
  private constructor(url: string, query: any, headers: any, timeout: any) {
    this.url = url;
    this.headers = headers;
    this.timeout = timeout;
    this.query = query;
  }

  /**
   * getFullUrl
   */
  public getFullUrl(): string {
    const qs: string = stringify(this.query);

    if (qs.length === 0) {
      return this.url;
    }

    return `${this.url}?${qs}`;
  }

  /**
   * createFromFastify
   * @param req
   * @param proxyMap
   */
  public static createFromFastify(req: any, proxyMap: Map<string, Resource>) {
    // TODO: get timeout
    const path: string = req.raw.url.split('?')[0];
    const resource: Resource | undefined = proxyMap.get(path);

    if (resource === undefined) {
      throw Error("resource not setting");
    }

    // host情報は消す
    const headers: any = req.headers;
    headers.host = "";

    return new RequestVo(`${resource.upstream}`, req.query, headers, resource.timeoutMs);
  }
}