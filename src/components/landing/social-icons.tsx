const PATHS = {
  facebook: "M14 8h3V4h-3c-2.8 0-4 1.8-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5H14z",
  twitter: "M4 4l7.2 9.6L4.3 20h2l5.8-5.4L16.5 20H20l-7.6-10.1L19 4h-2l-5.3 4.9L8 4H4z",
  linkedin: "M5 9h3.5v11H5V9zm1.7-5.5a2 2 0 110 4 2 2 0 010-4zM10.5 9h3.3v1.5c.5-.9 1.7-1.8 3.4-1.8 3.4 0 4 2.2 4 5.1V20h-3.5v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V20h-3.5V9z",
  youtube: "M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 00-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 001.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z",
} as const;

export type SocialName = keyof typeof PATHS;

export function SocialIcon({ name, size = 18 }: { name: SocialName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={PATHS[name]} />
    </svg>
  );
}
