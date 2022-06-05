import { thumbnail } from "ytdl-core";

export interface IMusicQueueListRedisEntity {
  id: string;
  name: string;
  thumbnails: thumbnail[];
  musicLengthInSecond: number;
  requestedAt: number;
  downloaded: boolean;
  fileName: string | null;
  readyAt: number | null;
  shouldBeEndAt: number | null;
}
