"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { WaveInput } from "@/components/ui/wave-input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Brand } from "@/components/layout/brand";
import { DEMO_CREDENTIALS, USERS } from "@/data/users";
import { IMAGES } from "@/data/content";
import { createLogger } from "@/lib/logger";
import { fadeUp, spring, stagger } from "@/lib/motion";
import { useAuth } from "@/providers/auth-provider";
import type { UserRole } from "@/types";

const log = createLogger("ui.login");

const SHAPES = [
  { className: "-left-24 top-10 h-72 w-72 rotate-12 bg-accent/10", delay: 0 },
  { className: "right-10 -top-10 h-32 w-32 rotate-45 bg-surface", delay: 0.1 },
  { className: "-right-16 bottom-0 h-80 w-80 -rotate-12 bg-warm/15", delay: 0.2 },
  { className: "left-16 bottom-16 h-14 w-14 rotate-12 bg-surface", delay: 0.3 },
];

export default function LoginPage() {
  const router = useRouter();
  const { user, ready, signIn } = useAuth();
  const [role, setRole] = useState<UserRole>("learner");
  const [email, setEmail] = useState<string>(DEMO_CREDENTIALS.learner.email);
  const [password, setPassword] = useState<string>(DEMO_CREDENTIALS.learner.password);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace("/dashboard");
  }, [ready, user, router]);

  const selectRole = (next: UserRole) => {
    setRole(next);
    setEmail(DEMO_CREDENTIALS[next].email);
    setPassword(DEMO_CREDENTIALS[next].password);
    setError(null);
    log.info("Role selected", { role: next });
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Enter your email and password");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await signIn(email, password);
      router.replace("/dashboard");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Unable to sign in");
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-peach px-4 py-10 sm:px-8">
      {SHAPES.map((shape) => (
        <motion.span
          key={shape.className}
          aria-hidden
          className={`absolute rounded-[48px] ${shape.className}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, transition: { ...spring, delay: shape.delay } }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1, transition: spring }}
        className="relative grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-line bg-surface lg:min-h-[680px] lg:grid-cols-2"
      >
        <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col justify-between gap-10 px-6 py-8 sm:px-12">
          <motion.div variants={fadeUp} className="flex items-center justify-between">
            <Brand />
            <ThemeToggle />
          </motion.div>

          <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
            <motion.div variants={fadeUp} className="text-center">
              <h1 className="text-4xl font-semibold tracking-tight text-ink">Welcome back!</h1>
              <p className="mt-3 text-sm text-muted">Select an account type and sign in to continue your learning journey.</p>
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Account type">
              {USERS.map((candidate) => {
                const active = role === candidate.role;
                return (
                  <motion.button
                    key={candidate.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectRole(candidate.role)}
                    className={`flex items-center gap-3 rounded-2xl p-3 text-left transition-colors ${active ? "bg-accent-soft" : "bg-subtle hover:bg-accent-soft"}`}
                  >
                    <Avatar src={candidate.avatar} name={candidate.name} size={40} />
                    <span>
                      <span className="block text-sm font-medium capitalize text-ink">{candidate.role}</span>
                      <span className="block text-xs text-muted">{candidate.name}</span>
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>

            <motion.form variants={fadeUp} onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
              <WaveInput label="Email address" type="email" value={email} onChange={setEmail} autoComplete="username" icon={<Mail size={18} aria-hidden />} />
              <WaveInput
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
                icon={<Lock size={18} aria-hidden />}
                trailing={
                  <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)} className="text-muted transition-colors hover:text-ink">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
              <button type="button" onClick={() => log.info("Forgot password requested", { email })} className="self-start text-sm font-medium text-accent hover:underline">
                Forgot password?
              </button>
              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} role="alert" className="text-sm text-red-600">
                  {error}
                </motion.p>
              )}
              <Button type="submit" size="lg" loading={submitting} fullWidth className="h-14 rounded-2xl">
                {submitting ? "Signing in" : "Sign in"}
              </Button>
            </motion.form>

            <motion.p variants={fadeUp} className="text-center text-sm text-ink">
              Need help? Contact us at <br />
              <a href="mailto:support@learnify.demo" className="font-medium text-accent hover:underline">
                support@learnify.demo
              </a>
            </motion.p>
          </div>

          <motion.p variants={fadeUp} className="text-center text-xs text-muted">
            © 2026 Learnify. Demo application with sample data.
          </motion.p>
        </motion.div>

        <div className="relative hidden bg-subtle lg:block">
          <Image src={IMAGES.login} alt="Bright study desk with notebook and laptop" fill priority sizes="600px" className="object-cover" unoptimized />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, transition: { ...spring, delay: 0.4 } }}
            className="absolute inset-x-10 bottom-12 rounded-3xl border border-white/30 bg-slate-900/35 p-8 text-white backdrop-blur-md"
          >
            <motion.span aria-hidden className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/15" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}>
              <BookOpen size={22} />
            </motion.span>
            <h2 className="text-2xl font-semibold leading-snug">Learn from practitioners who build real products</h2>
            <p className="mt-3 text-sm text-white/85">Track progress, earn certificates, and give your team the analytics to measure skill growth, all in one platform.</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
