export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  stackTrace: string | null;
  context?: Record<string, unknown>;
  sessionId?: string;
  userRole?: string | null;
  route?: string;
  runtime: "client" | "server";
}
