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
 * @param {...unknown[]} details
 */
function logHttp(level: "info" | "error" | "debug" | "warn", ...details: unknown[]): void {
  const context = asyncLocalStorage.getStore();
  const method = context?.method || "UNKNOWN";
  const url = context?.url || "UNKNOWN";

  // This is the cleaned-up message (no extra timestamp or level)
  const header = `${level.toUpperCase()} : ${method} | ${url}`;
  const body = details
    .map((d) => {
      if (typeof d === "string" || typeof d === "number") {
        return d;
      } else if (typeof d === "object" && d !== null) {
        try {
          return JSON.stringify(d, null, 2);
        } catch {
          return "[Unserializable Object]";
        }
      } else {
        return String(d);
      }
    })
    .join("\n");

  const finalMessage = `${header}\n${body}`;

  if (typeof logger[level] === "function") {
    logger[level](finalMessage);
  } else {
    logger.info(finalMessage);
  }
}

export { logger, logHttp, asyncLocalStorage };
