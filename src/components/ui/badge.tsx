type Tone = "neutral" | "accent" | "warm" | "danger";

const TONES: Record<Tone, string> = {
  neutral: "bg-subtle text-muted border border-line",
  accent: "bg-accent-soft text-accent",
  warm: "bg-warm/15 text-warm",
  danger: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: Tone }) {
  return <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${TONES[tone]}`}>{children}</span>;
}
