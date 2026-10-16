import { createLogger } from "@/lib/logger/logger";

export function registerNodeInstrumentation(): void {
  const log = createLogger("system.server");
  process.on("uncaughtException", (error) => log.fatal("Uncaught server exception", error));
  process.on("unhandledRejection", (reason) => log.error("Unhandled server rejection", reason));
  log.info("Server instrumentation registered", { nodeVersion: process.version });
}
