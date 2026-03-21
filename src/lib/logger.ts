type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  [key: string]: unknown;
}

const isProduction = process.env.NODE_ENV === "production";

function createEntry(
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>
): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };
}

function info(message: string, meta?: Record<string, unknown>) {
  const entry = createEntry("info", message, meta);
  if (isProduction) {
    console.log(JSON.stringify(entry));
  } else {
    console.info(`\x1b[36m[INFO]\x1b[0m ${entry.timestamp} — ${message}`, meta ?? "");
  }
}

function warn(message: string, meta?: Record<string, unknown>) {
  const entry = createEntry("warn", message, meta);
  if (isProduction) {
    console.log(JSON.stringify(entry));
  } else {
    console.warn(`\x1b[33m[WARN]\x1b[0m ${entry.timestamp} — ${message}`, meta ?? "");
  }
}

function error(message: string, meta?: Record<string, unknown>) {
  const entry = createEntry("error", message, meta);
  if (isProduction) {
    console.log(JSON.stringify(entry));
  } else {
    console.error(`\x1b[31m[ERROR]\x1b[0m ${entry.timestamp} — ${message}`, meta ?? "");
  }
}

export const logger = { info, warn, error };
