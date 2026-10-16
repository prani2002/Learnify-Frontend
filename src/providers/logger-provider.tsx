"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createLogger, installGlobalHandlers } from "@/lib/logger";

const log = createLogger("router");

export function LoggerProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => installGlobalHandlers(), []);

  useEffect(() => {
    log.info("Route changed", { pathname, referrer: document.referrer || null });
  }, [pathname]);

  return <>{children}</>;
}
