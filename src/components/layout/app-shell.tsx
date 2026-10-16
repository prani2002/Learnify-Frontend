"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Bug, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Brand } from "@/components/layout/brand";
import { PageTransition } from "@/components/layout/page-transition";
import { ErrorBoundary } from "@/components/system/error-boundary";
import { RenderFaultProbe, useFaults } from "@/components/system/fault-panel";
import { createLogger } from "@/lib/logger";
import { spring } from "@/lib/motion";
import { useAuth } from "@/providers/auth-provider";

const log = createLogger("ui.app-shell");

const NAVIGATION = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, ready, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { openPanel, resetToken } = useFaults();

  useEffect(() => {
    if (ready && !user) {
      log.warn("Unauthenticated access redirected", { pathname });
      router.replace("/login");
    }
  }, [ready, user, router, pathname]);

  useEffect(() => setMenuOpen(false), [pathname]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Skeleton className="h-8 w-40" />
      </div>
    );
  }

  const sidebar = (
    <nav className="flex flex-col gap-1">
      {NAVIGATION.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${active ? "text-accent" : "text-muted hover:bg-subtle hover:text-ink"}`}
          >
            {active && <motion.span layoutId="nav-active" transition={spring} className="absolute inset-0 rounded-lg bg-accent-soft" />}
            <item.icon size={18} className="relative" aria-hidden />
            <span className="relative">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-subtle">
      <aside style={{ top: "var(--banner-height, 0px)" }} className="fixed bottom-0 left-0 hidden w-64 flex-col justify-between border-r border-line bg-surface p-4 lg:flex">
        <div className="flex flex-col gap-8">
          <div className="px-3 pt-2">
            <Brand href="/dashboard" />
          </div>
          {sidebar}
        </div>
        <p className="px-3 text-xs text-muted capitalize">{user.role} workspace</p>
      </aside>

      <div className="lg:pl-64">
        <header style={{ top: "var(--banner-height, 0px)" }} className="sticky z-30 flex h-16 items-center justify-between border-b border-line bg-surface px-4 sm:px-8">
          <button type="button" aria-label="Open navigation" className="flex h-10 w-10 items-center justify-center rounded-lg bg-subtle lg:hidden" onClick={() => setMenuOpen(true)}>
            <Menu size={18} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            {user.role === "admin" && (
              <button
                type="button"
                aria-label="Diagnostics"
                onClick={openPanel}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 transition-colors hover:bg-red-200 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
              >
                <Bug size={18} aria-hidden />
              </button>
            )}
            <ThemeToggle />
            <div className="flex items-center gap-3 rounded-lg border border-line py-1 pl-1 pr-3">
              <Avatar src={user.avatar} name={user.name} size={32} />
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-medium text-ink">{user.name}</p>
                <p className="text-xs capitalize text-muted">{user.role}</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Sign out"
              onClick={() => {
                signOut();
                router.replace("/");
              }}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-subtle text-muted transition-colors hover:bg-accent-soft hover:text-accent"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-page px-4 py-8 sm:px-8">
          <ErrorBoundary resetKey={`${pathname}:${resetToken}`}>
            <RenderFaultProbe />
            <PageTransition>{children}</PageTransition>
          </ErrorBoundary>
        </main>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="fixed inset-0 z-40 bg-ink/20 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)}>
            <motion.div
              className="h-full w-64 bg-surface p-4"
              initial={{ x: -256 }}
              animate={{ x: 0, transition: spring }}
              exit={{ x: -256 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-8 flex items-center justify-between px-3 pt-2">
                <Brand href="/dashboard" />
                <button type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)}>
                  <X size={18} />
                </button>
              </div>
              {sidebar}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
