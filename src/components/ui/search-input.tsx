"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  onBlur?: () => void;
  className?: string;
  size?: "sm" | "md";
}

export function SearchInput({ value, onChange, placeholder, label, onBlur, className = "", size = "md" }: SearchInputProps) {
  return (
    <label className={`search-field ${className}`}>
      <span className="sr-only">{label}</span>
      <Search size={16} className="search-icon pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`${size === "sm" ? "h-9" : "h-10"} rounded-xl pl-9 pr-3 text-sm text-ink`}
      />
    </label>
  );
}
