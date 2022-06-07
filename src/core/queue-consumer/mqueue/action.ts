import { FastifyRedis } from "@fastify/redis";
import { Channel, ConsumeMessage } from "amqplib";
import { RedisInstance } from "../../../redis/instance";
import {
  addListItem,
  findListItemIndexAndItsElement,
  updateListAtSpecificIndex,
} from "../../../redis/ops/common";
import { SocketInstance } from "../../../socket/instance";
import { startDownloadProcess } from "../../modules-facilitate/ytdl-core";

import ytdl from "ytdl-core";
import { IMusicQueueListRedisEntity } from "../../../interfaces/music-queue.interfaces";
import { existsSync } from "fs";
import store from "store";
import { sendMusicUpdatedDataToAllPeers } from "../../events";

export async function MQUEUE_PUBLIC_ACTION_IsMusicStillInDownloading(
  videoID: string
): Promise<boolean> {
  const status: boolean = await store.get(`vidID-${videoID}-downloading`);
  return status;
}

async function MQUEUE_PRIV_ACTION_SetMusicDownloadingStatus(
  videoID: string,
  status: boolean
): Promise<void> {
  await store.set(`vidID-${videoID}-downloading`, status);
}

async function MQUEUE_PRIV_ACTION_PushMusicToQueue(
  vidDetail: ytdl.VideoDetails,
  alreadyExist: boolean = false
): Promise<void> {
  const redisListEntity: IMusicQueueListRedisEntity = {
    id: vidDetail.videoId,
    name: vidDetail.title,
    thumbnails: vidDetail.thumbnails,
    musicLengthInSecond: parseInt(vidDetail.lengthSeconds),
    requestedAt: new Date().getTime(),
    downloaded: alreadyExist ? true : false,
    fileName: alreadyExist ? `${vidDetail.videoId}.mp3` : null,
    readyAt: null,
    shouldBeEndAt: null,
  };

  await addListItem("music-queue-list", redisListEntity);

  sendMusicUpdatedDataToAllPeers();
}

export async function MQUEUE_ACTION_StartDownloadingProcess(
  ch: Channel,
  qmsg: ConsumeMessage,
  vidDetail: ytdl.VideoDetails
): Promise<void> {
  const redisInstance: FastifyRedis = RedisInstance.getInstance();

  //
  // ─── CHECK IF FILE IS ALREADY EXIST ─────────────────────────────────────────────
  //
  const filePath: string = `${process.env.PWD}/public/temp/${vidDetail.videoId}.mp3`;
  if (
    existsSync(filePath) &&
    !(await MQUEUE_PUBLIC_ACTION_IsMusicStillInDownloading(vidDetail.videoId))
  ) {
    console.log(
      `found ${vidDetail.videoId} already existed and not in download`
    );
    await MQUEUE_PRIV_ACTION_PushMusicToQueue(vidDetail, true); // immeditely append to the queue
    ch.ack(qmsg);
    return;
  }
  // ────────────────────────────────────────────────────────────────────────────────

  async function onFinish(fileName: string): Promise<void> {
    console.log(`${fileName} saved into the public/temp folder`);
    MQUEUE_PRIV_ACTION_SetMusicDownloadingStatus(vidDetail.videoId, false);
    SocketInstance.getInstance().emit(`download-finished-${vidDetail.videoId}`); // emit to inform that the download progress is finished

    const [listIndex, listItem] =
      await findListItemIndexAndItsElement<IMusicQueueListRedisEntity>(
        "music-queue-list",
        (data: IMusicQueueListRedisEntity) => data.id === vidDetail.videoId,
        true
      );
    if (listIndex !== -1) {
      listItem!.fileName = fileName;
      listItem!.downloaded = true;

      await updateListAtSpecificIndex("music-queue-list", listIndex, listItem);
    }

    ch.ack(qmsg);
  }

  function onProgress(percent: number): void {
    console.log(
      `[MQUEUE_ACTION_StartDownloadingProcess](${vidDetail.videoId}): progress -> ${percent}%`
    );
    SocketInstance.getInstance().emit(
      `download-progress-${vidDetail.videoId}`,
      percent
    ); // emit to inform the download progress
  }

  try {
    await MQUEUE_PRIV_ACTION_PushMusicToQueue(vidDetail);
  } catch (error) {
    console.log(error);
    ch.nack(qmsg, false, false); // eject the msg
    return;
  }

  startDownloadProcess(vidDetail, onFinish, onProgress);
  MQUEUE_PRIV_ACTION_SetMusicDownloadingStatus(vidDetail.videoId, true);
}
