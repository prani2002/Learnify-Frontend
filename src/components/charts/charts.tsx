"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { spring, springSoft } from "@/lib/motion";
import type { DataPoint } from "@/types";

const SERIES = ["rgb(var(--accent))", "rgb(var(--warm))", "rgb(var(--sky))", "rgb(var(--gold))", "rgb(var(--plum))"];

export function seriesColor(index: number): string {
  return SERIES[index % SERIES.length];
}

interface AreaChartProps {
  data: DataPoint[];
  format?: (value: number) => string;
  color?: string;
  height?: number;
}

export function AreaChart({ data, format = (value) => value.toLocaleString(), color = "rgb(var(--accent))", height = 190 }: AreaChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const width = 600;
  const pad = { top: 16, right: 12, bottom: 28, left: 48 };
  const max = Math.max(...data.map((point) => point.value));
  const min = Math.min(...data.map((point) => point.value));
  const upper = Math.ceil(max / 10 ** (String(Math.round(max)).length - 1)) * 10 ** (String(Math.round(max)).length - 1);
  const lower = Math.floor((min * 0.8) / 10 ** (String(Math.round(min)).length - 1)) * 10 ** (String(Math.round(min)).length - 1);
  const x = (index: number) => pad.left + (index / (data.length - 1)) * (width - pad.left - pad.right);
  const y = (value: number) => pad.top + (1 - (value - lower) / (upper - lower)) * (height - pad.top - pad.bottom);
  const line = data.map((point, index) => `${index === 0 ? "M" : "L"}${x(index)},${y(point.value)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${height - pad.bottom} L${x(0)},${height - pad.bottom} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => lower + (upper - lower) * ratio);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Trend chart" onMouseLeave={() => setHovered(null)}>
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={pad.left} x2={width - pad.right} y1={y(tick)} y2={y(tick)} stroke="rgb(var(--line))" strokeWidth={1} />
          <text x={pad.left - 8} y={y(tick) + 4} textAnchor="end" fontSize={11} fill="rgb(var(--muted))">
            {tick >= 1000 ? `${Number((tick / 1000).toFixed(1))}K` : Math.round(tick)}
          </text>
        </g>
      ))}
      <motion.path d={area} fill={color} fillOpacity={0.1} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
      <motion.path d={line} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: "easeOut" }} />
      {data.map((point, index) => (
        <g key={point.label} onMouseEnter={() => setHovered(index)}>
          <rect x={x(index) - 20} y={pad.top} width={40} height={height - pad.top - pad.bottom} fill="transparent" />
          <text x={x(index)} y={height - 8} textAnchor="middle" fontSize={11} fill="rgb(var(--muted))">
            {point.label}
          </text>
          <motion.circle cx={x(index)} cy={y(point.value)} r={hovered === index ? 5 : 3} fill="rgb(var(--surface))" stroke={color} strokeWidth={2} animate={{ r: hovered === index ? 5 : 3 }} transition={springSoft} />
        </g>
      ))}
      {hovered !== null && (
        <g pointerEvents="none">
          <line x1={x(hovered)} x2={x(hovered)} y1={pad.top} y2={height - pad.bottom} stroke="rgb(var(--muted))" strokeDasharray="3 3" />
          <rect x={Math.min(Math.max(x(hovered) - 44, 0), width - 88)} y={Math.max(y(data[hovered].value) - 40, 0)} width={88} height={28} rx={6} fill="rgb(var(--ink))" />
          <text x={Math.min(Math.max(x(hovered), 44), width - 44)} y={Math.max(y(data[hovered].value) - 22, 18)} textAnchor="middle" fontSize={12} fill="rgb(var(--canvas))">
            {format(data[hovered].value)}
          </text>
        </g>
      )}
    </svg>
  );
}

export function BarChart({ data, height = 150, unit = "", highlightMax = true }: { data: DataPoint[]; height?: number; unit?: string; highlightMax?: boolean }) {
  const max = Math.max(...data.map((point) => point.value), 1);
  return (
    <div className="flex items-end gap-3" style={{ height }} role="img" aria-label="Bar chart">
      {data.map((point, index) => {
        const peak = highlightMax && point.value === max;
        return (
          <div key={point.label} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="text-xs font-medium text-ink opacity-0 transition-opacity group-hover:opacity-100">
              {point.value}
              {unit}
            </span>
            <motion.div
              className="w-full rounded-md"
              style={{ backgroundColor: peak ? "rgb(var(--accent))" : "rgb(var(--accent) / 0.35)" }}
              initial={{ height: 0 }}
              animate={{ height: `${(point.value / max) * 78}%` }}
              transition={{ ...spring, delay: index * 0.05 }}
            />
            <span className="text-xs text-muted">{point.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function HorizontalBars({ data, unit = "%", max = 100 }: { data: DataPoint[]; unit?: string; max?: number }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {data.map((point, index) => (
        <li key={point.label} className="row-fx -mx-2 rounded-lg px-2 py-0.5">
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-ink">{point.label}</span>
            <span className="text-muted">
              {point.value}
              {unit}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <motion.div className="h-full rounded-full" style={{ backgroundColor: seriesColor(index) }} initial={{ width: 0 }} animate={{ width: `${(point.value / max) * 100}%` }} transition={{ ...springSoft, delay: index * 0.06 }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function DonutChart({ data, centerLabel }: { data: DataPoint[]; centerLabel?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((sum, point) => sum + point.value, 0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offsets = data.map((_, index) => data.slice(0, index).reduce((sum, point) => sum + (point.value / total) * circumference, 0));
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 140 140" className="h-28 w-28 shrink-0 -rotate-90" role="img" aria-label="Distribution chart">
        <circle cx={70} cy={70} r={radius} fill="none" stroke="rgb(var(--line))" strokeWidth={18} />
        {data.map((point, index) => {
          const length = (point.value / total) * circumference;
          return (
            <motion.circle
              key={point.label}
              cx={70}
              cy={70}
              r={radius}
              fill="none"
              stroke={seriesColor(index)}
              strokeWidth={active === index ? 22 : 18}
              strokeDashoffset={-offsets[index]}
              style={{ opacity: active === null || active === index ? 1 : 0.35, transition: "opacity 250ms ease, stroke-width 250ms ease" }}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${Math.max(length - 2, 0)} ${circumference}` }}
              transition={{ ...spring, delay: index * 0.1 }}
            />
          );
        })}
        <text x={70} y={70} textAnchor="middle" dominantBaseline="middle" fontSize={active === null ? 15 : 22} fontWeight={600} fill="rgb(var(--ink))" transform="rotate(90 70 70)">
          {active === null ? centerLabel : `${data[active].value}%`}
        </text>
      </svg>
      <ul className="flex min-w-0 flex-1 flex-col gap-1 text-xs">
        {data.map((point, index) => (
          <li key={point.label} onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)} className="row-fx -mx-1.5 flex items-center justify-between gap-2 rounded-md px-1.5 py-0.5">
            <span className="inline-flex min-w-0 items-center gap-2 text-ink">
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: seriesColor(index) }} aria-hidden />
              <span className="truncate">{point.label}</span>
            </span>
            <span className="text-muted">{point.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Deterministic pseudo-random series used for KPI sparklines. */
export function seedSeries(seed: string, trend: "up" | "down", points = 12): number[] {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return Array.from({ length: points }, (_, index) => {
    const noise = Math.abs(Math.sin(hash + index * 7.31) * 10000) % 1;
    const slope = (trend === "up" ? index : points - index) / points;
    return 20 + slope * 50 + noise * 22;
  });
}

export function Sparkline({ data, color = "rgb(var(--accent))", className = "" }: { data: number[]; color?: string; className?: string }) {
  const width = 64;
  const height = 32;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const x = (index: number) => (index / (data.length - 1)) * width;
  const y = (value: number) => 3 + (1 - (value - min) / (max - min || 1)) * (height - 6);
  const line = data.map((value, index) => `${index === 0 ? "M" : "L"}${x(index).toFixed(1)},${y(value).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden preserveAspectRatio="none">
      <motion.path d={line} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: "easeOut" }} />
    </svg>
  );
}

export function RingProgress({ value, size = 96, label }: { value: number; size?: number; label?: string }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${value}% complete`}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx={50} cy={50} r={radius} fill="none" stroke="rgb(var(--line))" strokeWidth={9} />
        <motion.circle cx={50} cy={50} r={radius} fill="none" stroke="rgb(var(--accent))" strokeWidth={9} strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference * (1 - value / 100) }} transition={{ duration: 1.1, ease: "easeOut" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-tight">
        <span className="text-lg font-semibold text-ink">{value}%</span>
        {label && <span className="text-[10px] text-muted">{label}</span>}
      </div>
    </div>
  );
}

export function ActivityHeatmap({ weeks = 20, seed = 7 }: { weeks?: number; seed?: number }) {
  const cells = Array.from({ length: weeks * 7 }, (_, index) => {
    const value = Math.abs(Math.sin(index * 12.9898 + seed) * 43758.5453) % 1;
    const weekday = index % 7;
    return weekday > 4 ? value * 0.5 : value;
  });
  return (
    <div className="flex gap-1 overflow-x-auto" role="img" aria-label="Learning activity over the last weeks">
      {Array.from({ length: weeks }, (_, week) => (
        <div key={week} className="flex flex-col gap-1">
          {cells.slice(week * 7, week * 7 + 7).map((value, day) => (
            <motion.span
              key={day}
              className="block h-3.5 w-3.5 rounded-[4px] transition-transform duration-200 hover:scale-125"
              style={{ backgroundColor: value < 0.15 ? "rgb(var(--line))" : `rgb(var(--accent) / ${0.25 + value * 0.75})` }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (week * 7 + day) * 0.004, ...springSoft }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
