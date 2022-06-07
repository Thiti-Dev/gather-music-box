import { VideoDetails } from "ytdl-core";

export interface IMusicQueueListRedisEntity {
  id: string;
  name: string;
  thumbnails: VideoDetails["thumbnails"];
  musicLengthInSecond: number;
  requestedAt: number;
  downloaded: boolean;
  fileName: string | null;
  readyAt: number | null;
  shouldBeEndAt: number | null;
}
