"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createLogger } from "@/lib/logger";

const log = createLogger("ui.route-error");

export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    log.error("Route segment error", error, { digest: error.digest });
  }, [error]);

  return (
    <div role="alert" className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold text-ink">Something went wrong</h1>
      <p className="text-sm text-muted">The error has been recorded.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
