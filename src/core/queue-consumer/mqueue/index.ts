//
// ─── LISTENER ───────────────────────────────────────────────────────────────────

import { Channel } from "amqplib";
import { M_QUEUE_QUEUE_NAME } from "../../../constants/vars";
import { QueueInstance } from "../../../queue/instance";
import { MQUEUE_ACTION_StartDownloadingProcess } from "./action";

//
(async () => {
  const ch: Channel = await QueueInstance.getInstance().createChannel();
  await ch.assertQueue(M_QUEUE_QUEUE_NAME);
  await ch.prefetch(2);

  ch.consume(M_QUEUE_QUEUE_NAME, (msg) => {
    if (msg !== null) {
      console.log(`[Queue-Consumer](${M_QUEUE_QUEUE_NAME}): recieved message`);
      MQUEUE_ACTION_StartDownloadingProcess(
        ch,
        msg,
        JSON.parse(msg.content.toString())
      );
    } else {
      console.log("Consumer cancelled by server");
    }
  });

  console.log("[QUEUE](MQUEUE-CONSUMER): successfully set up");
})();
// ────────────────────────────────────────────────────────────────────────────────
