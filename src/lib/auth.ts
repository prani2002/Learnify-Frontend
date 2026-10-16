import { DEMO_CREDENTIALS, USERS } from "@/data/users";
import type { User, UserRole } from "@/types";

const STORAGE_KEY = "lms.session";

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export async function authenticate(email: string, password: string): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  const normalized = email.trim().toLowerCase();
  const match = (Object.keys(DEMO_CREDENTIALS) as UserRole[]).find(
    (role) => DEMO_CREDENTIALS[role].email === normalized && DEMO_CREDENTIALS[role].password === password,
  );
  const user = USERS.find((candidate) => candidate.role === match);
  if (!match || !user) throw new AuthenticationError("Invalid email or password");
  return user;
}

export function readSession(): User | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function writeSession(user: User | null): void {
  try {
    if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
}
