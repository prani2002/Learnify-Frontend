import { createLogger } from "@/lib/logger";

const log = createLogger("fault-injection");

export type FaultKind =
  | "unhandled-rejection"
  | "null-pointer"
  | "render-failure"
  | "async-timer-error"
  | "network-failure"
  | "json-parse"
  | "server-error";

export interface FaultDefinition {
  kind: FaultKind;
  label: string;
  description: string;
}

export const FAULTS: readonly FaultDefinition[] = [
  { kind: "unhandled-rejection", label: "Unhandled promise rejection", description: "Rejects a promise without a handler." },
  { kind: "null-pointer", label: "Null reference", description: "Reads a property of a null value in a deferred task." },
  { kind: "render-failure", label: "Render failure", description: "Throws while rendering a component tree." },
  { kind: "async-timer-error", label: "Uncaught async error", description: "Throws inside a timer callback." },
  { kind: "network-failure", label: "Failed network request", description: "Calls an endpoint that always responds with 500." },
  { kind: "json-parse", label: "Malformed payload", description: "Parses an invalid JSON document." },
  { kind: "server-error", label: "Server exception", description: "Triggers an unhandled error in a route handler." },
];

interface FaultHooks {
  triggerRenderFailure: () => void;
}

interface UserProfile {
  address?: { city: string };
}

export async function injectFault(kind: FaultKind, hooks: FaultHooks): Promise<void> {
  log.warn("Fault injection requested", { kind });
  switch (kind) {
    case "unhandled-rejection":
      void Promise.reject(new Error("Injected unhandled promise rejection"));
      return;
    case "null-pointer":
      setTimeout(() => {
        const profile = null as UserProfile | null;
        const city = (profile as UserProfile).address!.city;
        log.info("Unreachable", { city });
      }, 0);
      return;
    case "render-failure":
      hooks.triggerRenderFailure();
      return;
    case "async-timer-error":
      setTimeout(() => {
        throw new RangeError("Injected uncaught error in timer callback");
      }, 0);
      return;
    case "network-failure": {
      const response = await fetch("/api/faults?mode=failure");
      if (!response.ok) {
        log.error("Injected network failure", new Error(`HTTP ${response.status} from /api/faults`), { status: response.status });
      }
      return;
    }
    case "json-parse":
      try {
        JSON.parse("{\"courses\": [");
      } catch (error) {
        log.error("Injected malformed payload", error);
      }
      return;
    case "server-error": {
      const response = await fetch("/api/faults?mode=throw");
      log.error("Injected server exception", new Error(`HTTP ${response.status} from /api/faults`), { status: response.status });
      return;
    }
  }
}

export function pickRandomFault(): FaultKind {
  return FAULTS[Math.floor(Math.random() * FAULTS.length)].kind;
}
