"use client";

import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { LearnerDashboard } from "@/components/dashboard/learner-dashboard";
import { useAuth } from "@/providers/auth-provider";

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === "admin" ? <AdminDashboard name={user.name} /> : <LearnerDashboard name={user.name} />;
}
