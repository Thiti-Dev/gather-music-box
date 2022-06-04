import { FastifyReply, FastifyRequest } from "fastify";
import { CONFIGS } from "../configs/config";
import { changeMusic } from "../core/gather";
import { downloadMP3FromYoutubeURL } from "../core/modules-facilitate/ymp3d";
import { RedisInstance } from "../redis/instance";

import snakecaseKeys from "snakecase-keys";
import { FastifyRedis } from "@fastify/redis";

import publicIp from "public-ip";
import { SocketInstance } from "../socket/instance";
import store from "store";
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
    "public/temp/",
    async (filePath: string) => {
      const ipv4: string = await publicIp.v4();
      const publicMusicURL: string = `${process.env.DEPLOYMENT_URL}/${filePath}`;
      console.log(publicMusicURL);
      await changeMusic(
        CONFIGS.gatherCredential,
        publicMusicURL,
        (target: any) =>
          target.id === process.env.GATHER_TARGET_OBJECT_ID &&
          target.x === +!process.env.GATHER_TARGET_X &&
          target.y === +!process.env.GATHER_TARGET_Y
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
      SocketInstance.getInstance().emit("download-progress", 100);

      SocketInstance.getInstance().emit(
        "video-updated",
        snakecaseKeys(
          JSON.parse(
            await RedisInstance.getInstance().call("JSON.GET", "music-box-json")
          )
        )
      );
    },
    (progress) => {
      SocketInstance.getInstance().emit(
        "download-progress",
        parseInt(progress.percent)
      );
    }
  ).catch(() => {
    reply.status(400).send({ message: "invalid given url" });
    return;
  });

  const reqStamptation: number = new Date().getTime();

  const redisEntity = {
    name: musicDetail.name,
    thumbnail: musicDetail.thumbnail,
    musicLengthInSecond: parseInt(musicDetail.seconds),
    ready: false,
    requestedAt: reqStamptation,
    readyAt: null,
    shouldBeEndAt: null,
  };

  redisInstance.call(
    "JSON.SET",
    "music-box-json",
    ".",
    JSON.stringify(redisEntity)
  );

  SocketInstance.getInstance().emit(
    "video-updated",
    snakecaseKeys(redisEntity)
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
