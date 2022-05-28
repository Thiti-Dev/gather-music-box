import Fastify from "fastify";
import path from "path";
import { CONFIGS } from "./configs/config";
import { getMapContent } from "./core/gather";
import "./core/process/handle-rejection";

const fastify: ReturnType<typeof Fastify> = Fastify({
  logger: true,
});

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "../public"),
  prefix: "/public/",
});

fastify.register(require("./routes/music"), {
  logLevel: "warn",
  prefix: "/music",
});

fastify.register(require("./routes/admin"), {
  logLevel: "warn",
  prefix: "/admin",
});

fastify.get("/", (request, reply) => {
  reply.send({ success: true });
});

fastify.listen(3000, (err, address) => {
  if (err) throw err;
});
