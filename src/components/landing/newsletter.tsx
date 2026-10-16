"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createLogger } from "@/lib/logger";
import { spring } from "@/lib/motion";
import { sectionViewport } from "./section-heading";

const log = createLogger("ui.newsletter");
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      setError("Enter a valid email address");
      log.warn("Newsletter validation failed", { email });
      return;
    }
    setError(null);
    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 900));
    log.info("Newsletter subscription", { email });
    setStatus("done");
  };

  return (
    <section id="newsletter" className="mx-auto max-w-page px-4 py-24 sm:px-8">
      <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0, transition: spring }} viewport={sectionViewport} className="flex flex-col items-center gap-6 rounded-3xl bg-accent px-6 py-16 text-center text-accent-ink sm:px-12">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Subscribe for latest courses and updates</h2>
        <p className="max-w-xl opacity-80">Join over 10,000 students and get exclusive access to new courses, special offers, and learning resources delivered straight to your inbox.</p>
        <AnimatePresence mode="wait">
          {status === "done" ? (
            <motion.p key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 rounded-lg bg-canvas px-4 py-3 font-medium text-ink">
              <Check size={18} aria-hidden /> You are subscribed. Check your inbox.
            </motion.p>
          ) : (
            <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0 }} className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">Email address</span>
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email address"
                  className="h-12 w-full rounded-lg border border-transparent bg-canvas pl-10 pr-3 text-sm text-ink"
                />
              </label>
              <Button type="submit" variant="warm" size="lg" loading={status === "submitting"}>
                <Send size={16} aria-hidden /> Subscribe now
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
        {error && (
          <p role="alert" className="text-sm">
            {error}
          </p>
        )}
        <p className="text-xs opacity-70">We respect your privacy. Unsubscribe at any time.</p>
      </motion.div>
    </section>
  );
}
