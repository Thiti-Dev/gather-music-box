import { FastifyReply, FastifyRequest } from "fastify";
import { CONFIGS } from "../configs/config";
import { changeMusic, getMapContent } from "../core/gather";
import { downloadMP3FromYoutubeURL } from "../core/modules-facilitate/ymp3d";

export const getMapContentHandler = async (
  request: FastifyRequest<any>,
  reply: FastifyReply
) => {
  const mapContent = await getMapContent(CONFIGS.gatherCredential);
  reply.send({ data: mapContent });
};
