"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggleTheme}
      className={`relative h-8 w-14 shrink-0 rounded-full transition-colors duration-300 ${dark ? "bg-accent" : "bg-line"}`}
    >
      <motion.span
        className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-soft"
        animate={{ x: dark ? 24 : 0 }}
        whileTap={{ width: 28 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
            transition={{ duration: 0.15 }}
            className={`flex ${dark ? "text-slate-700" : "text-warm"}`}
          >
            {dark ? <Moon size={14} aria-hidden /> : <Sun size={14} aria-hidden />}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </button>
  );
}
