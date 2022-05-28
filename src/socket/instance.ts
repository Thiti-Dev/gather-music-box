import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export class SocketInstance {
  private static instance: Server<DefaultEventsMap>;
  public static setInstance(instance: Server<DefaultEventsMap>) {
    this.instance = instance;
    console.log("[SocketInstance](class): Socket instance has benn initiated");
  }
  public static getInstance(): Server<DefaultEventsMap> {
    return this.instance;
  }
}
