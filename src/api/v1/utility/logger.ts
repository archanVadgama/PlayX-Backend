import { pino } from "pino";
import { AsyncLocalStorage } from "async_hooks";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
    },
  },
});

const asyncLocalStorage = new AsyncLocalStorage<{
  method: string;
  url: string;
}>();

/**
 * Logs HTTP requests with a specific log level and details.
 *
 * @param {("info" | "error" | "debug" | "warn")} level
 * @param {...any[]} details
 */
function logHttp(level: "info" | "error" | "debug" | "warn", ...details: any[]): void {
  const context = asyncLocalStorage.getStore();
  const method = context?.method || "UNKNOWN";
  const url = context?.url || "UNKNOWN";

  // This is the cleaned-up message (no extra timestamp or level)
  const header = `${level.toUpperCase()} : ${method} | ${url}`;
  const body = details
    .map((d) => (typeof d === "object" ? JSON.stringify(d, null, 2) : String(d)))
    .join("\n");

  const finalMessage = `${header}\n${body}`;

  if (typeof logger[level] === "function") {
    logger[level](finalMessage);
  } else {
    logger.info(finalMessage);
  }
}

export { logger, logHttp, asyncLocalStorage };
