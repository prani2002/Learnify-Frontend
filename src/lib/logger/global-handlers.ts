import { createLogger, flushLogs } from "./logger";

const log = createLogger("system.global");
let installed = false;

export function installGlobalHandlers(): () => void {
  if (installed || typeof window === "undefined") return () => undefined;
  installed = true;

  const onError = (event: ErrorEvent) => {
    log.error("Uncaught exception", event.error ?? event.message, {
      source: event.filename,
      line: event.lineno,
      column: event.colno,
    });
  };

  const onRejection = (event: PromiseRejectionEvent) => {
    log.error("Unhandled promise rejection", event.reason ?? "unknown reason");
  };

  const onResourceError = (event: Event) => {
    const target = event.target as HTMLElement | null;
    if (target && target !== (window as unknown as HTMLElement) && "src" in target) {
      log.warn("Resource failed to load", { tag: target.tagName, src: (target as HTMLImageElement).src });
    }
  };

  const onHide = () => flushLogs();

  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    originalConsoleError.apply(console, args);
    const first = args[0];
    if (typeof first === "string" && first.startsWith("{") && first.includes('"level"')) return;
    log.warn("console.error intercepted", { args: args.map((arg) => (arg instanceof Error ? arg.message : String(arg))) });
  };

  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);
  window.addEventListener("error", onResourceError, true);
  window.addEventListener("pagehide", onHide);
  document.addEventListener("visibilitychange", onHide);
  log.info("Global error handlers installed");

  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onRejection);
    window.removeEventListener("error", onResourceError, true);
    window.removeEventListener("pagehide", onHide);
    document.removeEventListener("visibilitychange", onHide);
    console.error = originalConsoleError;
    installed = false;
  };
}
