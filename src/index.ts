// get weather today in city
// get weather tomorrow in city
// get weather in city over the year
// get weather ' is it going to snow/rain/sunshine today'

import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
