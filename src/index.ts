import {routes} from "./routes";
import {connectToRedis} from "./redis";
import Fastify from "fastify";
import dotenv from 'dotenv';
import fastifyEnv from "@fastify/env";
import rateLimit from '@fastify/rate-limit'
import redis from '@fastify/redis'

const fastify = Fastify({
  logger: true,
});

dotenv.config({ path: 'env' });

fastify.register(routes);
 fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
})

const schema = {
  type: 'object',
  required: [ 'WEATHER_API_KEY' ],
  properties: {
    WEATHER_API_KEY: {
      type: 'string',
      default: undefined
    }
  }
}

const options = {
  schema,
  dotenv: true
}

fastify.register(connectToRedis).ready((err) => {
  console.log('connected to redis')
  if (err) console.error(err)
})

fastify.register(redis, {
  host: '127.0.0.1'
})


fastify
  .register(fastifyEnv, options)
  .ready((err) => {
    if (err) console.error(err)
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  } 
};

start();

fastify.setErrorHandler(function (error, request, reply) {
  if (error.statusCode === 429) {
    reply.code(429)
    error.message = 'You hit the rate limit!'
  }
  reply.send(error)
})
