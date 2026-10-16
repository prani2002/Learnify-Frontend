"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FAULTS, injectFault, type FaultDefinition, type FaultKind } from "@/lib/faults";
import { createLogger } from "@/lib/logger";
import { spring } from "@/lib/motion";

const log = createLogger("fault-injection.ui");
const BANNER_DURATION_MS = 10000;

interface FaultContextValue {
  openPanel: () => void;
  trigger: (kind: FaultKind) => void;
  renderFault: boolean;
  resetToken: number;
}

const FaultContext = createContext<FaultContextValue | null>(null);

export function useFaults(): FaultContextValue {
  const context = useContext(FaultContext);
  if (!context) throw new Error("useFaults must be used within FaultProvider");
  return context;
}

export function RenderFaultProbe(): null {
  const { renderFault } = useFaults();
  if (renderFault) throw new Error("Injected render failure in component tree");
  return null;
}

export function FaultProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [renderFault, setRenderFault] = useState(false);
  const [active, setActive] = useState<FaultDefinition | null>(null);
  const [resetToken, setResetToken] = useState(0);

  const trigger = useCallback((kind: FaultKind) => {
    setActive(FAULTS.find((fault) => fault.kind === kind) ?? null);
    void injectFault(kind, { triggerRenderFailure: () => setRenderFault(true) }).catch((error) =>
      log.error("Fault injection failed", error, { kind }),
    );
  }, []);

  const stopSimulation = useCallback(() => {
    setRenderFault(false);
    setActive(null);
    setResetToken((value) => value + 1);
    log.info("Fault simulation stopped, application state restored");
  }, []);

  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(stopSimulation, BANNER_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [active, stopSimulation]);

  useEffect(() => {
    document.documentElement.style.setProperty("--banner-height", active ? "40px" : "0px");
    return () => document.documentElement.style.setProperty("--banner-height", "0px");
  }, [active]);

  useEffect(() => {
    if (!renderFault) return;
    const timer = window.setTimeout(() => setRenderFault(false), 100);
    return () => window.clearTimeout(timer);
  }, [renderFault]);

  const value = useMemo(
    () => ({ resetToken, openPanel: () => {
      setOpen(true);
      log.info("Diagnostics panel opened");
    }, trigger, renderFault }),
    [trigger, renderFault, resetToken],
  );

  return (
    <FaultContext.Provider value={value}>
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.kind}
            role="status"
            className="fixed inset-x-0 top-0 z-[60] flex h-10 items-center justify-center gap-3 bg-warm px-4 text-sm text-onwarm"
            initial={{ y: -40 }}
            animate={{ y: 0, transition: spring }}
            exit={{ y: -40 }}
          >
            <span className="truncate">
              You are currently simulating <strong className="font-semibold">{active.label}</strong>. {active.description}
            </span>
            <button type="button" onClick={stopSimulation} className="shrink-0 font-medium underline underline-offset-2">
              Stop simulating
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-ink/20 p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-label="Diagnostics"
              className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-soft"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: spring }}
              exit={{ opacity: 0, y: 16 }}
              onClick={(event) => event.stopPropagation()}
            >
              <h2 className="text-lg font-semibold text-ink">Diagnostics</h2>
              <p className="mt-1 text-sm text-muted">Inject a fault to verify logging coverage.</p>
              <ul className="mt-4 flex flex-col gap-2">
                {FAULTS.map((fault) => (
                  <li key={fault.kind}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        trigger(fault.kind);
                      }}
                      className="w-full rounded-lg bg-subtle px-4 py-2 text-left transition-colors hover:bg-accent-soft"
                    >
                      <span className="block text-sm font-medium text-ink">{fault.label}</span>
                      <span className="block text-xs text-muted">{fault.description}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </FaultContext.Provider>
  );
}
