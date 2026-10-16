"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NAV_LINKS } from "@/data/content";
import { spring } from "@/lib/motion";

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-peach">
      <div className="mx-auto flex h-20 max-w-page items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-10">
          <Brand />
          <nav className="hidden items-center gap-6 text-sm font-medium text-ink xl:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-accent">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden gap-3 sm:flex">
            <Button href="/login" variant="ghost">
              Login
            </Button>
            <Button href="/login">
              Sign up
            </Button>
          </div>
          <button type="button" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface xl:hidden">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={spring} className="overflow-hidden border-t border-line bg-peach xl:hidden" aria-label="Mobile">
            <div className="mx-auto flex max-w-page flex-col gap-1 px-4 py-4 sm:px-8">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-surface">
                  {link.label}
                </a>
              ))}
              <div className="mt-2 flex gap-3 sm:hidden">
                <Button href="/login" variant="secondary">Login</Button>
                <Button href="/login">Sign up</Button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
