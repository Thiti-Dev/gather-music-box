import Fastify from "fastify";

export function setUpRedisDatabase(fastify: ReturnType<typeof Fastify>) {
  fastify.register(require("@fastify/redis"), {
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: parseInt(process.env.REDIS_PORT as string),
  });
}
