import {routes} from "./routes";
import {connectToRedis} from "./redis";
import Fastify from "fastify";
import dotenv from 'dotenv';

const fastify = Fastify({
  logger: true,
});

dotenv.config({ path: 'env' });
// fastify.register(await connectToRedis());
fastify.register(routes);

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  } 
};

start();
