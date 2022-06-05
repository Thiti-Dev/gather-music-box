import amqplib from "amqplib";

export class QueueInstance {
  private static instance: amqplib.Connection;
  private static senderChannel: amqplib.Channel;
  public static setInstance(instance: amqplib.Connection) {
    this.instance = instance;
    console.log("[QueueInstance](class): Queue instance has benn initiated");
    this.createInstanceSenderChannel();
    require("../core/queue-consumer"); // set up the consumer
  }
  public static getInstance(): amqplib.Connection {
    return this.instance;
  }
  public static async createInstanceSenderChannel() {
    const senderCH: amqplib.Channel = await this.instance.createChannel();
    this.senderChannel = senderCH;
    console.log("[QueueInstance](class): Sender Channel has been initiated");
  }

  public static sendMessage(queueName: string, message: string) {
    this.senderChannel.sendToQueue(queueName, Buffer.from(message));
  }
}
