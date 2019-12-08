import { RequestHandler } from "fastify";
import {repository} from "@infrastructure/repository";
import {Response} from "@application/type/response";

/**
 * proxy
 * @param req
 * @param res
 */
export const proxy: RequestHandler = async (req, res) => {
  const response: Response = await repository.fetch({
    headers: req.headers,
    url: req.hostname//TODO: qs
  });

  response.header.forEach((value, key) => {
    res.header(key, value);
  });

  res.send(response.data);
};
