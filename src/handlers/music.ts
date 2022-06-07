import { FastifyReply, FastifyRequest } from "fastify";
import { RedisInstance } from "../redis/instance";
import snakecaseKeys from "snakecase-keys";
import { QueueInstance } from "../queue/instance";
import { M_QUEUE_QUEUE_NAME } from "../constants/vars";
import ytdl from "ytdl-core";
import { getVideoInfoFromURL } from "../core/modules-facilitate/ytdl-core";
import { removeAllListItem } from "../redis/ops/common";
import { MQUEUE_PUBLIC_ACTION_IsMusicStillInDownloading } from "../core/queue-consumer/mqueue/action";
export const requestMusicHandler = async (
  request: FastifyRequest<any>,
  reply: FastifyReply
) => {
  if (!request.body?.yt_url) {
    reply.status(400).send({ message: "please specified yt_url in the body" });
    return;
  }

  try {
    const vidInfo: ytdl.videoInfo = await getVideoInfoFromURL(
      request.body.yt_url
    );

    if (
      await MQUEUE_PUBLIC_ACTION_IsMusicStillInDownloading(
        vidInfo.videoDetails.videoId
      )
    ) {
      return reply
        .status(400)
        .send({ message: "music still in downloading queue" });
    }

    QueueInstance.sendMessage(
      M_QUEUE_QUEUE_NAME,
      JSON.stringify(vidInfo.videoDetails)
    );
    reply.send({ data: vidInfo.videoDetails });
  } catch {
    return reply.status(400).send({ message: "invalid given url" });
  }
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

export const clearQueueHandler = async (
  request: FastifyRequest<any>,
  reply: FastifyReply
) => {
  await removeAllListItem("music-queue-list");
  reply.send({ success: true });
};
