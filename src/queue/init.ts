import amqplib from "amqplib";
import { QueueInstance } from "./instance";
export async function createQueueConnection() {
  const connection: amqplib.Connection = await amqplib.connect(
    process.env.AMQP_CONNECTION_URL!
  );
  QueueInstance.setInstance(connection);
}
