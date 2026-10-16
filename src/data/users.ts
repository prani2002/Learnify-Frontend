import type { User } from "@/types";

export const DEMO_CREDENTIALS = {
  admin: { email: "admin@lms.demo", password: "Admin@123" },
  learner: { email: "learner@lms.demo", password: "Learner@123" },
} as const;

export const USERS: readonly User[] = [
  {
    id: "usr_admin",
    name: "Morgan Hayes",
    email: DEMO_CREDENTIALS.admin.email,
    role: "admin",
    title: "Learning Operations Lead",
    avatar: "/avatars/admin.svg",
  },
  {
    id: "usr_learner",
    name: "Priya Raman",
    email: DEMO_CREDENTIALS.learner.email,
    role: "learner",
    title: "Frontend Developer",
    avatar: "/avatars/learner.svg",
  },
];
