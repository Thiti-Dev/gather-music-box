import { IMusicQueueListRedisEntity } from "../../interfaces/music-queue.interfaces";
import { getList } from "../../redis/ops/common";
import { SocketInstance } from "../../socket/instance";

export async function sendMusicUpdatedDataToAllPeers(): Promise<void> {
  const instance = SocketInstance.getInstance();

  const list: IMusicQueueListRedisEntity = await getList(
    "music-queue-list",
    true
  );
  instance.emit("list-updated", list);
}
