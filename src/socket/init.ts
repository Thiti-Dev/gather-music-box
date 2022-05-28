import { RawServerDefault } from "fastify";
import { Server } from "socket.io";

export function initializeSocketIO(server: RawServerDefault) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    var address = socket.handshake.address;
    console.log(`[${address}]: has connected`);

    socket.on("disconnect", () => {
      console.log(`[${address}]: has disconnected`);
    });
  });

  console.log("[SOCKET-IO]: has been initialized");
}
