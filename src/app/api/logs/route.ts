import { NextResponse } from "next/server";
import type { LogEntry } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { entries?: LogEntry[] };
    const entries = Array.isArray(body.entries) ? body.entries.slice(0, 200) : [];
    for (const entry of entries) {
      process.stdout.write(`${JSON.stringify({ ...entry, ingestedAt: new Date().toISOString(), source: "client" })}\n`);
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
