import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger/logger";

const log = createLogger("api.faults");

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const mode = new URL(request.url).searchParams.get("mode");
  if (mode === "throw") {
    const record = undefined as unknown as { id: string };
    return NextResponse.json({ id: record.id });
  }
  log.error("Injected network failure endpoint hit", new Error("Simulated upstream failure"), { mode });
  return NextResponse.json({ error: "Simulated upstream failure" }, { status: 500 });
}
