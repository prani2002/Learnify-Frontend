"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Sparkline, seedSeries } from "@/components/charts/charts";
import { fadeUp } from "@/lib/motion";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon?: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  goodWhenDown?: boolean;
  spark?: boolean;
}

export function StatCard({ label, value, change, trend, icon: Icon, goodWhenDown, spark = true }: StatCardProps) {
  const positive = trend === "up" ? !goodWhenDown : Boolean(goodWhenDown);
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <motion.div variants={fadeUp} className="min-w-0 rounded-2xl border border-line bg-surface p-3">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <Icon size={16} aria-hidden />
          </span>
        )}
        <p className="text-xs font-medium leading-tight text-muted">{label}</p>
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="text-2xl font-semibold leading-none text-ink">{value}</p>
        {spark && <Sparkline data={seedSeries(label, trend ?? "up")} className="h-8 w-20 shrink-0" color={trend && !positive ? "rgb(var(--warm))" : "rgb(var(--accent))"} />}
      </div>
      <p className={`mt-2 inline-flex min-h-4 items-center gap-1 text-[11px] font-medium ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
        {change && trend && (
          <>
            <TrendIcon size={12} aria-hidden /> {change} <span className="font-normal text-muted">vs last period</span>
          </>
        )}
      </p>
    </motion.div>
  );
}
