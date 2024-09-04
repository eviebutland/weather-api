import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from "fastify";
import { getWeatherToday } from "./get";

export async function routes(fastify: FastifyInstance, options: FastifyServerOptions) {
  fastify.get("/today", async (request: FastifyRequest, reply: FastifyReply) => {
   getWeatherToday(request, reply)// this will call a function in the get file
  });
}


