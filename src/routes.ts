import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from "fastify";
import { getWeatherConditionToday, getWeatherToday, getWeatherTomorrow } from "./get";

export async function routes(fastify: FastifyInstance, options: FastifyServerOptions) {

  // console.log('redis', fastify)
  fastify.get("/today",  (request: FastifyRequest, reply: FastifyReply) =>  getWeatherToday(fastify.redis, request, reply))
  // fastify.get('/foo', (req, reply) => {
  //   const { redis } = fastify
  //   getWeatherToday(redis, request, reply)
  // })
  fastify.get("/tomorrow", (request: FastifyRequest, reply: FastifyReply) => getWeatherTomorrow(fastify.redis, request, reply))
  fastify.get("/weather-condition-today", (request: FastifyRequest, reply: FastifyReply) => getWeatherConditionToday(fastify.redis, request, reply))
}


