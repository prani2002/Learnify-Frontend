"use client";

interface WaveInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
}

export function WaveInput({ label, type = "text", value, onChange, autoComplete, icon, trailing }: WaveInputProps) {
  return (
    <div className="wave-field rounded-2xl bg-subtle">
      {icon && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder=" "
        aria-label={label}
        className={`h-14 w-full bg-transparent pb-1 pt-5 text-sm text-ink ${icon ? "pl-12" : "pl-4"} ${trailing ? "pr-12" : "pr-4"}`}
      />
      <span className={`wave-label pointer-events-none absolute top-1/2 flex -translate-y-1/2 text-sm text-muted ${icon ? "left-12" : "left-4"}`} aria-hidden>
        {label.split("").map((char, index) => (
          <span key={index} className="wave-char" style={{ "--index": index } as React.CSSProperties}>
            {char}
          </span>
        ))}
      </span>
      <span className="wave-bar absolute inset-x-0 bottom-0 block h-0.5" aria-hidden />
      {trailing && <span className="absolute right-4 top-1/2 -translate-y-1/2">{trailing}</span>}
    </div>
  );
}
