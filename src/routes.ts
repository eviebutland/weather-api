import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from "fastify";
import { getWeatherConditionToday, getWeatherToday, getWeatherTomorrow } from "./get";

export async function routes(fastify: FastifyInstance, options: FastifyServerOptions) {
  fastify.get("/today",  getWeatherToday)
  fastify.get("/tomorrow",  getWeatherTomorrow)
  fastify.get("/weather-condition-today",  getWeatherConditionToday)
}


