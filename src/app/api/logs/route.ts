import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import type { LogEntry } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { entries?: LogEntry[] };
    const entries = Array.isArray(body.entries) ? body.entries.slice(0, 200) : [];
    const lines = entries.map(
      (entry) => `${JSON.stringify({ ...entry, ingestedAt: new Date().toISOString(), source: "client" })}\n`,
    );
    for (const line of lines) process.stdout.write(line);
    if (process.env.NODE_ENV !== "production" && lines.length > 0) {
      // Dev-only sink read by the app-logs MCP server (mcp/logs-server).
      await mkdir(join(process.cwd(), ".logs"), { recursive: true });
      await appendFile(join(process.cwd(), ".logs", "app.ndjson"), lines.join(""));
    }
    return NextResponse.json({ accepted: entries.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    process.stdout.write(
      `${JSON.stringify({ timestamp: new Date().toISOString(), level: "error", module: "api.logs", message: `Invalid log payload: ${message}`, stackTrace: error instanceof Error ? error.stack : null })}\n`,
    );
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
