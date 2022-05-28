import { FastifyReply, FastifyRequest } from "fastify";
import { CONFIGS } from "../configs/config";
import { changeMusic } from "../core/gather";
import { downloadMP3FromYoutubeURL } from "../core/modules-facilitate/ymp3d";
import { RedisInstance } from "../redis/instance";

import snakecaseKeys from "snakecase-keys";

export const requestMusicHandler = async (
  request: FastifyRequest<any>,
  reply: FastifyReply
) => {
  if (!request.body?.yt_url) {
    reply.status(400).send({ message: "please specified yt_url in the body" });
    return;
  }

  const musicDetail = await downloadMP3FromYoutubeURL(
    request.body.yt_url,
    "public/temp/current.mp3"
  ).catch(() => {
    reply.status(400).send({ message: "invalid given url" });
    return;
  });

  RedisInstance.getInstance().call(
    "JSON.SET",
    "music-box-json",
    ".",
    JSON.stringify({
      name: musicDetail.name,
      musicLengthInSecond: musicDetail.seconds,
      ready: false,
      readyAt: null,
    })
  );

  /*changeMusic(
    CONFIGS.gatherCredential,
    "https://dl2.soundcloudmp3.org/api/download/eyJpdiI6Iis3dWxRSGN2K3JjZzJMZVNFVlZpaVE9PSIsInZhbHVlIjoidVdzNnJKZXRTaFZob0QwVjdNVGd2MmhyOVhEeEF0eXZjU1lkcGVlRkw4NG84ODF6cVBuTWJWTVNudXVJbzJhT2xnODhIOTFoZEc3YTdmakRwRGFzSWdcL3hUTzRLMnIxWFFTSkFDUDA5V3VnK2lQM3JhT0QzanYwYmpVSFwvT1hQUGVrbGtQSmk2dFpJaEcyKzk2aUdYNGc0K1pzXC9GXC95SmQ4Qjg2a3RBbVg5RT0iLCJtYWMiOiJjZjE0MDIwNTFjZWI1YTY0NjYxN2VjYjE4YTU2N2ZhMTM4YzhlYjA1NzdhMjRjMTg0NDVmMjY1N2Y3M2M1MTg4In0=",
    (target: any) =>
      target.id === "SPJxItemShop-Sound-001" &&
      target.x === 57 &&
      target.y === 32
  );*/
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
