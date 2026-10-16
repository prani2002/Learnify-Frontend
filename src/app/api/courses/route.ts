import { NextResponse } from "next/server";
import { COURSES } from "@/data/courses";
import { createLogger } from "@/lib/logger/logger";

const log = createLogger("api.courses");

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  log.info("Course catalog requested", { count: COURSES.length });
  return NextResponse.json({ courses: COURSES });
}
