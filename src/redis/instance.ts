import { FastifyRedis } from "@fastify/redis";

export class RedisInstance {
  private static instance: FastifyRedis;
  public static setInstance(instance: FastifyRedis) {
    this.instance = instance;
    console.log("[RedisInstance](class): Redis instance has benn initiated");
  }
  public static getInstance(): FastifyRedis {
    return this.instance;
  }
}
