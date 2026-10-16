"use client";

import { useMemo, useState } from "react";
import { ArrowUp } from "lucide-react";

export type SortDir = "asc" | "desc";

export function useSort<T, K extends string>(rows: readonly T[], accessors: Record<K, (row: T) => string | number>, initial?: { key: K; dir: SortDir }) {
  const [sort, setSort] = useState<{ key: K; dir: SortDir } | null>(initial ?? null);

  const sorted = useMemo(() => {
    if (!sort) return [...rows];
    const get = accessors[sort.key];
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const left = get(a);
      const right = get(b);
      if (typeof left === "number" && typeof right === "number") return (left - right) * factor;
      return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: "base" }) * factor;
    });
    // accessors are static per table
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, sort]);

  const toggle = (key: K) =>
    setSort((current) => {
      if (!current || current.key !== key) return { key, dir: "asc" };
      return current.dir === "asc" ? { key, dir: "desc" } : null;
    });

  return { sorted, sort, toggle };
}

interface SortHeaderProps<K extends string> {
  label: string;
  sortKey: K;
  sort: { key: K; dir: SortDir } | null;
  onSort: (key: K) => void;
  className?: string;
}

export function SortHeader<K extends string>({ label, sortKey, sort, onSort, className = "" }: SortHeaderProps<K>) {
  const active = sort?.key === sortKey;
  return (
    <th scope="col" aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"} className={`py-2 font-medium ${className}`}>
      <button type="button" onClick={() => onSort(sortKey)} data-active={active} data-dir={active ? sort.dir : undefined} className="sort-btn inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide">
        {label}
        <ArrowUp size={12} className="sort-icon" aria-hidden />
      </button>
    </th>
  );
}
