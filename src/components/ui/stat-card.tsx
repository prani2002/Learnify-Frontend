"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { fadeUp } from "@/lib/motion";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon?: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  goodWhenDown?: boolean;
}

export function StatCard({ label, value, change, trend, icon: Icon, goodWhenDown }: StatCardProps) {
  const positive = trend === "up" ? !goodWhenDown : Boolean(goodWhenDown);
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -2 }} className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        {Icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <Icon size={16} aria-hidden />
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-semibold text-ink">{value}</p>
      {change && trend && (
        <p className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${positive ? "text-emerald-600" : "text-red-600"}`}>
          <TrendIcon size={14} aria-hidden /> {change} <span className="font-normal text-muted">vs last period</span>
        </p>
      )}
    </motion.div>
  );
}
