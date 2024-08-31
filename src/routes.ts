import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from "fastify";

async function routes(fastify: FastifyInstance, options: FastifyServerOptions) {
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return { hello: "world" }; // this will call a function in the get file
  });
}

export default routes;
