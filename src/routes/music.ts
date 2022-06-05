import Fastify, {
  FastifyPluginOptions,
  FastifyRegisterOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import {
  clearQueueHandler,
  getCurrentMusicDetailHandler,
  requestMusicHandler,
} from "../handlers/music";

export default function (
  fastify: ReturnType<typeof Fastify>,
  opts: FastifyRegisterOptions<FastifyPluginOptions>,
  done: Function
) {
  fastify.get("/", (req: FastifyRequest, reply: FastifyReply) => {
    reply.send({ success: true });
  });
  fastify.post("/request-music", requestMusicHandler);
  fastify.post("/clear-queue", clearQueueHandler);
  fastify.get("/current-music-detail", getCurrentMusicDetailHandler);
  done();
}
