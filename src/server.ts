require("dotenv").config({ debug: true, override: false });

import Fastify from "fastify";
import path from "path";
import { initiateCronProcesses } from "./core/crons";
import "./core/process/handle-rejection";
import { createQueueConnection } from "./queue/init";
import { setUpRedisDatabase } from "./redis/init";
import { initializeSocketIO } from "./socket/init";
const fastify: ReturnType<typeof Fastify> = Fastify({
  logger: true,
});

fastify.register(require("@fastify/cors"), function (instance) {
  return (req: any, callback: any) => {
    let corsOptions;
    const origin = req.headers.origin;
    const hostname = origin ? new URL(origin).hostname : "fetcher";
    //
    // ─── WHITELIST ORIGIN ────────────────────────────────────────────
    //
    const WHITELIST_ORIGINS: string[] = ["127.0.0.1", "localhost"];
    // ─────────────────────────────────────────────────────────────────

    if (process.env.ALLOW_ALL_ORIGIN === "true") {
      corsOptions = { origin: true };
    } else {
      if (WHITELIST_ORIGINS.includes(hostname)) {
        corsOptions = {
          origin: true,
        };
      } else {
        corsOptions = { origin: false };
      }
    }

    callback(null, corsOptions); // callback expects two parameters: error and options
  };
});

createQueueConnection();

initializeSocketIO(fastify.server);

setUpRedisDatabase(fastify);

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

fastify.listen(process.env.PORT || 3000, "0.0.0.0", (err, address) => {
  if (err) throw err;
});

initiateCronProcesses();
