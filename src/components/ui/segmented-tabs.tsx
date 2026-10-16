"use client";

import { motion } from "framer-motion";
import { spring } from "@/lib/motion";

interface SegmentedTabsProps<T extends string> {
  tabs: readonly { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  layoutId: string;
}

export function SegmentedTabs<T extends string>({ tabs, value, onChange, layoutId }: SegmentedTabsProps<T>) {
  return (
    <div role="tablist" className="inline-flex gap-1 rounded-xl bg-surface p-1">
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${active ? "text-accent-ink" : "text-muted hover:text-ink"}`}
          >
            {active && <motion.span layoutId={layoutId} transition={spring} className="absolute inset-0 rounded-lg bg-accent" />}
            <span className="relative">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
