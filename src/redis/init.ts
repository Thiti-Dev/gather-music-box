import Fastify from "fastify";
import { RedisInstance } from "./instance";

export async function setUpRedisDatabase(fastify: ReturnType<typeof Fastify>) {
  fastify.register(require("@fastify/redis"), {
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: parseInt(process.env.REDIS_PORT as string),
  });
  fastify.after(() => RedisInstance.setInstance(fastify.redis));
}
