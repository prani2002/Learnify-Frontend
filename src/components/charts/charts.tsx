"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { spring, springSoft } from "@/lib/motion";
import type { DataPoint } from "@/types";

const SERIES = ["rgb(var(--accent))", "rgb(var(--warm))", "rgb(var(--muted))", "rgb(var(--accent) / 0.5)", "rgb(var(--warm) / 0.5)"];

export function seriesColor(index: number): string {
  return SERIES[index % SERIES.length];
}

interface AreaChartProps {
  data: DataPoint[];
  format?: (value: number) => string;
  color?: string;
}

export function AreaChart({ data, format = (value) => value.toLocaleString(), color = "rgb(var(--accent))" }: AreaChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const width = 600;
  const height = 240;
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

export function BarChart({ data, height = 192, unit = "", highlightMax = true }: { data: DataPoint[]; height?: number; unit?: string; highlightMax?: boolean }) {
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
    <ul className="flex flex-col gap-4">
      {data.map((point, index) => (
        <li key={point.label}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-ink">{point.label}</span>
            <span className="text-muted">
              {point.value}
              {unit}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-line">
            <motion.div className="h-full rounded-full" style={{ backgroundColor: seriesColor(0) }} initial={{ width: 0 }} animate={{ width: `${(point.value / max) * 100}%` }} transition={{ ...springSoft, delay: index * 0.06 }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function DonutChart({ data, centerLabel }: { data: DataPoint[]; centerLabel?: string }) {
  const total = data.reduce((sum, point) => sum + point.value, 0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offsets = data.map((_, index) => data.slice(0, index).reduce((sum, point) => sum + (point.value / total) * circumference, 0));
  return (
    <div className="flex flex-col items-center gap-6">
      <svg viewBox="0 0 140 140" className="h-40 w-40 shrink-0 -rotate-90" role="img" aria-label="Distribution chart">
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
              strokeWidth={18}
              strokeDashoffset={-offsets[index]}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${Math.max(length - 2, 0)} ${circumference}` }}
              transition={{ ...spring, delay: index * 0.1 }}
            />
          );
        })}
        {centerLabel && (
          <text x={70} y={70} textAnchor="middle" dominantBaseline="middle" fontSize={16} fontWeight={600} fill="rgb(var(--ink))" transform="rotate(90 70 70)">
            {centerLabel}
          </text>
        )}
      </svg>
      <ul className="flex w-full flex-col gap-2 text-sm">
        {data.map((point, index) => (
          <li key={point.label} className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-ink">
              <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: seriesColor(index) }} aria-hidden />
              {point.label}
            </span>
            <span className="text-muted">{point.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ActivityHeatmap({ weeks = 14, seed = 7 }: { weeks?: number; seed?: number }) {
  const cells = Array.from({ length: weeks * 7 }, (_, index) => {
    const value = Math.abs(Math.sin(index * 12.9898 + seed) * 43758.5453) % 1;
    const weekday = index % 7;
    return weekday > 4 ? value * 0.5 : value;
  });
  return (
    <div className="flex gap-1.5 overflow-x-auto" role="img" aria-label="Learning activity over the last weeks">
      {Array.from({ length: weeks }, (_, week) => (
        <div key={week} className="flex flex-col gap-1.5">
          {cells.slice(week * 7, week * 7 + 7).map((value, day) => (
            <motion.span
              key={day}
              className="block h-4 w-4 rounded-[4px] sm:h-5 sm:w-5"
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
