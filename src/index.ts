import {routes} from "./routes";
import {connectToRedis} from "./redis";
import Fastify from "fastify";
import dotenv from 'dotenv';
import fastifyEnv from "@fastify/env";
const fastify = Fastify({
  logger: true,
});

dotenv.config({ path: 'env' });
// fastify.register(await connectToRedis());

fastify.register(routes);
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
