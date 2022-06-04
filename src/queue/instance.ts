import amqplib from "amqplib";

export class QueueInstance {
  private static instance: amqplib.Connection;
  public static setInstance(instance: amqplib.Connection) {
    this.instance = instance;
    console.log("[QueueInstance](class): Queue instance has benn initiated");
  }
  public static getInstance(): amqplib.Connection {
    return this.instance;
  }
}
