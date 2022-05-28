import { FastifyRedis } from "@fastify/redis";
import { RedisInstance } from "../../redis/instance";
import { SocketInstance } from "../../socket/instance";

const WHITELIST_ERRORS: string[] = ["Input stream error", "No video id found"];

const WHITELIST_EXCEPTIONS: string[] = ["Input stream error"];

process.on("unhandledRejection", (err: any) => {
  if (
    !WHITELIST_ERRORS.some((whitelistError) =>
      err.message.includes(whitelistError)
    )
  )
    process.exit(1);
});

process.on("uncaughtException", async function (err) {
  if (
    !WHITELIST_EXCEPTIONS.some((whitelistError) =>
      err.message.includes(whitelistError)
    )
  )
    process.exit(1);
  else {
    if (err.message.includes("Input stream error")) {
      const redisInstance: FastifyRedis = RedisInstance.getInstance();
      await redisInstance.call("JSON.DEL", "music-box-json");
      SocketInstance.getInstance().emit("video-reset");
      store.set("block", false);
    }
  }
});
