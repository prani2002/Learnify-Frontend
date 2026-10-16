import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const here = dirname(fileURLToPath(import.meta.url));
const LOG_FILE = process.env.APP_LOG_FILE ?? join(here, "..", "..", ".logs", "app.ndjson");

async function load() {
  let raw = "";
  try {
    raw = await readFile(LOG_FILE, "utf8");
  } catch {
    return [];
  }
  const out = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      out.push(JSON.parse(line));
    } catch {
      /* skip malformed line */
    }
  }
  return out;
}

const text = (rows) => ({
  content: [{ type: "text", text: rows.length ? rows.map((r) => JSON.stringify(r)).join("\n") : "No matching logs." }],
});

const server = new McpServer({ name: "app-logs", version: "1.0.0" });

server.tool(
  "tail_logs",
  "Most recent log entries, optionally filtered by level or module.",
  { n: z.number().int().min(1).max(500).default(50), level: z.string().optional(), module: z.string().optional() },
  async ({ n, level, module }) => {
    const rows = (await load()).filter((r) => (!level || r.level === level) && (!module || r.module === module));
    return text(rows.slice(-n));
  },
);

server.tool(
  "search_logs",
  "Search logs by text, with optional level/session/route/since (ISO timestamp) filters.",
  {
    query: z.string().optional(),
    level: z.string().optional(),
    sessionId: z.string().optional(),
    route: z.string().optional(),
    since: z.string().optional(),
    limit: z.number().int().min(1).max(500).default(100),
  },
  async ({ query, level, sessionId, route, since, limit }) => {
    const q = query?.toLowerCase();
    const rows = (await load()).filter(
      (r) =>
        (!level || r.level === level) &&
        (!sessionId || r.sessionId === sessionId) &&
        (!route || r.route === route) &&
        (!since || r.timestamp >= since) &&
        (!q || JSON.stringify(r).toLowerCase().includes(q)),
    );
    return text(rows.slice(-limit));
  },
);

server.tool(
  "get_errors",
  "Error-level logs (with stack traces) since an optional ISO timestamp.",
  { since: z.string().optional() },
  async ({ since }) => text((await load()).filter((r) => r.level === "error" && (!since || r.timestamp >= since))),
);

server.tool(
  "get_session",
  "Chronological timeline of one user session.",
  { sessionId: z.string() },
  async ({ sessionId }) => text((await load()).filter((r) => r.sessionId === sessionId)),
);

await server.connect(new StdioServerTransport());
