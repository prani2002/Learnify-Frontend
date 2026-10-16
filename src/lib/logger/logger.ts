import type { LogEntry, LogLevel } from "./types";

const LEVEL_WEIGHT: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40, fatal: 50 };
const BUFFER_LIMIT = 500;
const FLUSH_INTERVAL_MS = 2000;
const FLUSH_BATCH_SIZE = 20;

const isBrowser = typeof window !== "undefined";

interface LogState {
  sessionId: string;
  userRole: string | null;
  buffer: LogEntry[];
  queue: LogEntry[];
  listeners: Set<(entry: LogEntry) => void>;
  timer: ReturnType<typeof setTimeout> | null;
}

const state: LogState = {
  sessionId: createSessionId(),
  userRole: null,
  buffer: [],
  queue: [],
  listeners: new Set(),
  timer: null,
};

function createSessionId(): string {
  return `sess_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function serializeError(error: unknown): { message: string; stackTrace: string | null } {
  if (error instanceof Error) {
    return { message: error.message, stackTrace: error.stack ?? null };
  }
  if (typeof error === "string") {
    return { message: error, stackTrace: new Error(error).stack ?? null };
  }
  try {
    return { message: JSON.stringify(error), stackTrace: null };
  } catch {
    return { message: String(error), stackTrace: null };
  }
}

function minimumLevel(): LogLevel {
  return "debug";
}

function flush(): void {
  state.timer = null;
  if (!isBrowser || state.queue.length === 0) return;
  const batch = state.queue.splice(0, state.queue.length);
  const body = JSON.stringify({ entries: batch });
  try {
    if (navigator.sendBeacon && body.length < 60000) {
      const sent = navigator.sendBeacon("/api/logs", new Blob([body], { type: "application/json" }));
      if (sent) return;
    }
    void fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    return;
  }
}

function scheduleFlush(): void {
  if (state.queue.length >= FLUSH_BATCH_SIZE) {
    flush();
    return;
  }
  if (!state.timer) state.timer = setTimeout(flush, FLUSH_INTERVAL_MS);
}

function emit(entry: LogEntry): void {
  const line = JSON.stringify(entry);
  const sink =
    entry.level === "error" || entry.level === "fatal"
      ? console.error
      : entry.level === "warn"
        ? console.warn
        : console.log;
  sink.call(console, line);

  if (!isBrowser) return;
  state.buffer.push(entry);
  if (state.buffer.length > BUFFER_LIMIT) state.buffer.shift();
  state.listeners.forEach((listener) => listener(entry));
  state.queue.push(entry);
  scheduleFlush();
}

export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: unknown, context?: Record<string, unknown>): void;
  fatal(message: string, error?: unknown, context?: Record<string, unknown>): void;
  timed<T>(message: string, task: () => Promise<T>, context?: Record<string, unknown>): Promise<T>;
}

export function createLogger(module: string): Logger {
  const write = (
    level: LogLevel,
    message: string,
    error?: unknown,
    context?: Record<string, unknown>,
  ): void => {
    if (LEVEL_WEIGHT[level] < LEVEL_WEIGHT[minimumLevel()]) return;
    const serialized = error === undefined ? null : serializeError(error);
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      message: serialized ? `${message}: ${serialized.message}` : message,
      stackTrace: serialized?.stackTrace ?? null,
      context,
      sessionId: state.sessionId,
      userRole: state.userRole,
      route: isBrowser ? window.location.pathname : undefined,
      runtime: isBrowser ? "client" : "server",
    };
    emit(entry);
  };

  return {
    debug: (message, context) => write("debug", message, undefined, context),
    info: (message, context) => write("info", message, undefined, context),
    warn: (message, context) => write("warn", message, undefined, context),
    error: (message, error, context) => write("error", message, error ?? new Error(message), context),
    fatal: (message, error, context) => write("fatal", message, error ?? new Error(message), context),
    async timed(message, task, context) {
      const start = performance.now();
      try {
        const result = await task();
        write("info", message, undefined, { ...context, durationMs: Math.round(performance.now() - start) });
        return result;
      } catch (error) {
        write("error", `${message} failed`, error, { ...context, durationMs: Math.round(performance.now() - start) });
        throw error;
      }
    },
  };
}

export function setLogUserRole(role: string | null): void {
  state.userRole = role;
}

export function getLogBuffer(): readonly LogEntry[] {
  return state.buffer;
}

export function subscribeToLogs(listener: (entry: LogEntry) => void): () => void {
  state.listeners.add(listener);
  return () => state.listeners.delete(listener);
}

export function flushLogs(): void {
  flush();
}
