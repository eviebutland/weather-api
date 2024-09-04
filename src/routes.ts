import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from "fastify";
import { getWeatherToday } from "./get";

export async function routes(fastify: FastifyInstance, options: FastifyServerOptions) {
  fastify.get("/today",  getWeatherToday)
}


