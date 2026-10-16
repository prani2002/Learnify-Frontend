"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authenticate, readSession, writeSession } from "@/lib/auth";
import { createLogger, setLogUserRole } from "@/lib/logger";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => void;
}

const log = createLogger("auth");
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = readSession();
    setUser(session);
    setLogUserRole(session?.role ?? null);
    setReady(true);
    log.info("Session restored", { authenticated: Boolean(session), role: session?.role ?? null });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    log.info("Sign in attempt", { email });
    try {
      const authenticated = await authenticate(email, password);
      writeSession(authenticated);
      setUser(authenticated);
      setLogUserRole(authenticated.role);
      log.info("Sign in succeeded", { userId: authenticated.id, role: authenticated.role });
      return authenticated;
    } catch (error) {
      log.warn("Sign in rejected", { email, reason: error instanceof Error ? error.message : "unknown" });
      throw error;
    }
  }, []);

  const signOut = useCallback(() => {
    log.info("Sign out", { userId: user?.id });
    writeSession(null);
    setUser(null);
    setLogUserRole(null);
  }, [user]);

  const value = useMemo(() => ({ user, ready, signIn, signOut }), [user, ready, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
