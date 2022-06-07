import cron from "node-cron";
import { CONFIGS } from "../../../configs/config";
import { IMusicQueueListRedisEntity } from "../../../interfaces/music-queue.interfaces";
import {
  getList,
  popFromList,
  updateListAtSpecificIndex,
} from "../../../redis/ops/common";
import { changeMusic } from "../../gather";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function startNextMusicChangingProcess(fileName: string): Promise<any> {
  const publicMusicURL: string = `${process.env.DEPLOYMENT_URL}/public/temp/${fileName}`;
  return changeMusic(
    CONFIGS.gatherCredential,
    publicMusicURL,
    (target: any) =>
      target.id === process.env.GATHER_TARGET_OBJECT_ID &&
      target.x === +process.env.GATHER_TARGET_X! &&
      target.y === +process.env.GATHER_TARGET_Y!
  );
}

async function performMusicProceedFurtherStep(): Promise<any> {
  const queueListEntities = await getList<IMusicQueueListRedisEntity[]>(
    "music-queue-list",
    true
  );
  if (!queueListEntities.length) return;
  //pick the first
  const target = queueListEntities[0];
  //check if its downloaded = true but still haven't settle readyAt & shouldBeEndAt

  const nowUnix = new Date().getTime();
  if (target.downloaded && !target.readyAt) {
    await startNextMusicChangingProcess(target.fileName!);
    const now = new Date(),
      end = new Date();
    end.setSeconds(end.getSeconds() + target.musicLengthInSecond);
    await updateListAtSpecificIndex("music-queue-list", 0, {
      ...target,
      readyAt: now.getTime(),
      shouldBeEndAt: end.getTime(),
    } as IMusicQueueListRedisEntity);
  } else if (
    target.downloaded &&
    target.readyAt &&
    nowUnix > target.shouldBeEndAt!
  ) {
    console.log(
      "found music is playing and should stop and check if has next music in the queue"
    );
    if (queueListEntities.length > 1 && queueListEntities[1].downloaded) {
      console.log(
        "found next music pending in queue (and downloaded) <Pop the current and play next>"
      );
      // more in the queue play next music and Pop current
      const nextTarget = queueListEntities[1];
      await startNextMusicChangingProcess(nextTarget.fileName!);
      const now = new Date(),
        end = new Date();
      end.setSeconds(end.getSeconds() + nextTarget.musicLengthInSecond);
      await updateListAtSpecificIndex("music-queue-list", 1, {
        ...nextTarget,
        readyAt: now.getTime(),
        shouldBeEndAt: end.getTime(),
      } as IMusicQueueListRedisEntity);
      await popFromList("music-queue-list", true); // pop the very first element in queue
    } else {
      console.log("stop the current music");
      // stop the current music
      await startNextMusicChangingProcess("non-exist.mp3"); // tricky one to stop the current music
      await popFromList("music-queue-list", true); // pop the very first element in queue
    }
  }
}

export function musicControllerTick(): void {
  let inProgress: boolean = false;
  const job: cron.ScheduledTask = cron.schedule("*/1 * * * * *", async () => {
    if (inProgress) return;
    console.log("running a task every 1 second");
    inProgress = true; // block the cron from executing while the current process isn't finished
    await performMusicProceedFurtherStep();
    await sleep(3000);
    inProgress = false; // un-block the cron
  });
}
