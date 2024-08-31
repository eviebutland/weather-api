import routes from "./routes";
import redis from "./redis";
import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

fastify.register(redis);
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
