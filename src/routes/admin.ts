import Fastify, {
  FastifyPluginOptions,
  FastifyRegisterOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { getMapContentHandler } from "../handlers/admin";
export default function (
  fastify: ReturnType<typeof Fastify>,
  opts: FastifyRegisterOptions<FastifyPluginOptions>,
  done: Function
) {
  fastify.get("/", (req: FastifyRequest, reply: FastifyReply) => {
    reply.send({ success: true });
  });
  fastify.get("/get-map-content", getMapContentHandler);
  done();
}
