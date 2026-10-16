import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["selector", "[data-theme=\"dark\"]"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["var(--font-inter)", "system-ui", "sans-serif"] },
      colors: {
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        subtle: "rgb(var(--subtle) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        warm: { DEFAULT: "rgb(var(--warm) / <alpha-value>)", hover: "rgb(var(--warm-hover) / <alpha-value>)" },
        onwarm: "rgb(var(--on-warm) / <alpha-value>)",
        peach: "rgb(var(--peach) / <alpha-value>)",
        gold: "rgb(var(--gold) / <alpha-value>)",
        sky: "rgb(var(--sky) / <alpha-value>)",
        plum: "rgb(var(--plum) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          hover: "rgb(var(--accent-hover) / <alpha-value>)",
          soft: "rgb(var(--accent-soft) / <alpha-value>)",
          ink: "rgb(var(--accent-ink) / <alpha-value>)",
        },
      },
      boxShadow: {
        soft: "0 8px 24px -12px rgb(var(--shadow) / 0.12)",
      },
      maxWidth: { page: "1200px" },
    },
  },
  plugins: [],
};

export default config;
