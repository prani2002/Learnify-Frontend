"use client";

import { motion } from "framer-motion";
import { springSoft } from "@/lib/motion";

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <motion.div className="h-full rounded-full bg-accent" initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={springSoft} />
    </div>
  );
}
