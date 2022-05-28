import { FastifyReply, FastifyRequest } from "fastify";
import { CONFIGS } from "../configs/config";
import { changeMusic } from "../core/gather";
import { downloadMP3FromYoutubeURL } from "../core/modules-facilitate/ymp3d";
import { RedisInstance } from "../redis/instance";

import snakecaseKeys from "snakecase-keys";
import { FastifyRedis } from "@fastify/redis";

import publicIp from "public-ip";

export const requestMusicHandler = async (
  request: FastifyRequest<any>,
  reply: FastifyReply
) => {
  if (!request.body?.yt_url) {
    reply.status(400).send({ message: "please specified yt_url in the body" });
    return;
  }

  const redisInstance: FastifyRedis = RedisInstance.getInstance();

  const musicDetail = await downloadMP3FromYoutubeURL(
    request.body.yt_url,
    "public/temp/current.mp3",
    async (fileName: string) => {
      const ipv4: string = await publicIp.v4();
      const publicMusicURL: string = `${ipv4}:${process.env.PORT}/public/temp/current.mp3`;
      console.log(publicMusicURL);
      console.log(CONFIGS.gatherCredential);
      await changeMusic(
        CONFIGS.gatherCredential,
        publicMusicURL,
        (target: any) =>
          target.id === "SPJxItemShop-Sound-001" &&
          target.x === 57 &&
          target.y === 32
      );

      const now = new Date(),
        end = new Date();

      end.setSeconds(end.getSeconds() + parseInt(musicDetail.seconds));

      await Promise.all([
        redisInstance.call("JSON.SET", "music-box-json", ".ready", true),
        redisInstance.call(
          "JSON.SET",
          "music-box-json",
          ".readyAt",
          now.getTime()
        ),
        redisInstance.call(
          "JSON.SET",
          "music-box-json",
          ".shouldBeEndAt",
          end.getTime()
        ),
      ]);
      console.log("setting ready = true");
    }
  ).catch(() => {
    reply.status(400).send({ message: "invalid given url" });
    return;
  });

  redisInstance.call(
    "JSON.SET",
    "music-box-json",
    ".",
    JSON.stringify({
      name: musicDetail.name,
      musicLengthInSecond: parseInt(musicDetail.seconds),
      ready: false,
      requestedAt: new Date().getTime(),
      readyAt: null,
      shouldBeEndAt: null,
    })
  );
  reply.send(snakecaseKeys({ data: musicDetail }));
};

export const getCurrentMusicDetailHandler = async (
  request: FastifyRequest<any>,
  reply: FastifyReply
) => {
  const detail: any = await RedisInstance.getInstance().call(
    "JSON.GET",
    "music-box-json"
  );
  reply.send(
    snakecaseKeys({
      data: JSON.parse(detail) || null,
    })
  );
};
